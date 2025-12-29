import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/api-auth";
import { contentRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";

const createContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  publishedAt: z.string().optional(),
});

const updateContentSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  publishedAt: z.string().optional(),
});

// GET /api/content - List all content
export const GET = contentRateLimit(withAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const content = await db.content.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search } },
            { excerpt: { contains: search } },
            { content: { contains: search } },
          ]
        }),
        ...(status !== 'all' && { status: status as any }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.content.count({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search } },
            { excerpt: { contains: search } },
            { content: { contains: search } },
          ]
        }),
        ...(status !== 'all' && { status: status as any }),
      },
    });

    return NextResponse.json({
      success: true,
      data: content,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}, { requiredPermission: "content:view" }));

// POST /api/content - Create new content
export const POST = contentRateLimit(withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();
    const validatedData = createContentSchema.parse(body);

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newContent = await db.content.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        status: validatedData.status as any,
        type: 'PAGE',
        authorId: user.id,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: newContent,
      message: "Content created successfully"
    });
  } catch (error) {
    console.error("Content creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create content" },
      { status: 500 }
    );
  }
}, { requiredPermission: "content:create" }));

// PUT /api/content - Update content
export const PUT = contentRateLimit(withAuth(async (request: NextRequest, { user }) => {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Content ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateContentSchema.parse(updateData);

    // Check if content exists and user has permission
    const existingContent = await db.content.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // Only allow authors to edit their own content (unless admin)
    if (existingContent.authorId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "You can only edit your own content" },
        { status: 403 }
      );
    }

    const updatedContent = await db.content.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
        ...(validatedData.publishedAt && { publishedAt: new Date(validatedData.publishedAt) }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: "Content updated successfully"
    });
  } catch (error) {
    console.error("Content update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update content" },
      { status: 500 }
    );
  }
}, { requiredPermission: "content:edit" }));

// DELETE /api/content - Delete content
export const DELETE = contentRateLimit(withAuth(async (request: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Content ID is required" },
        { status: 400 }
      );
    }

    // Check if content exists and user has permission
    const existingContent = await db.content.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, error: "Content not found" },
        { status: 404 }
      );
    }

    // Only allow authors to delete their own content (unless admin)
    if (existingContent.authorId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "You can only delete your own content" },
        { status: 403 }
      );
    }

    const deletedContent = await db.content.delete({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: deletedContent,
      message: "Content deleted successfully"
    });
  } catch (error) {
    console.error("Content deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete content" },
      { status: 500 }
    );
  }
}, { requiredPermission: "content:delete" }));