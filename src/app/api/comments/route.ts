import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock comment data - in real app, this would come from database
let comments = [
  {
    id: "1",
    contentId: "1",
    content: "Great article! This really helped me understand the basics of content management systems.",
    author: {
      name: "Alice Brown",
      email: "alice.brown@example.com",
      avatar: "/api/placeholder/avatar-5.jpg"
    },
    createdAt: new Date("2024-01-20"),
    status: "approved",
    replies: [
      {
        id: "1-1",
        content: "I agree! The section on AI integration was particularly helpful.",
        author: {
          name: "Bob Smith",
          email: "bob.smith@example.com",
          avatar: "/api/placeholder/avatar-6.jpg"
        },
        createdAt: new Date("2024-01-20"),
        status: "approved"
      }
    ]
  },
  {
    id: "2",
    contentId: "1",
    content: "This is exactly what I've been looking for. Do you have any tutorials on implementation?",
    author: {
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      avatar: "/api/placeholder/avatar-7.jpg"
    },
    createdAt: new Date("2024-01-19"),
    status: "pending",
    replies: []
  },
  {
    id: "3",
    contentId: "2",
    content: "The web development best practices section is outdated. You should update it for 2024 standards.",
    author: {
      name: "Diana Wilson",
      email: "diana.wilson@example.com",
      avatar: "/api/placeholder/avatar-8.jpg"
    },
    createdAt: new Date("2024-01-18"),
    status: "pending",
    replies: []
  }
];

const createCommentSchema = z.object({
  contentId: z.string().min(1, "Content ID is required"),
  content: z.string().min(1, "Comment content is required"),
  author: z.object({
    name: z.string().min(2, "Author name is required"),
    email: z.string().email("Invalid email address").optional(),
    avatar: z.string().optional()
  }).optional()
});

const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").optional(),
  status: z.enum(["pending", "approved", "rejected", "spam"]).optional()
});

// GET /api/comments - List comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredComments = comments;

    // Filter by content ID
    if (contentId) {
      filteredComments = filteredComments.filter(comment => comment.contentId === contentId);
    }

    // Filter by status
    if (status !== 'all') {
      filteredComments = filteredComments.filter(comment => comment.status === status);
    }

    // Sort by creation date (newest first)
    filteredComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedComments,
      pagination: {
        page,
        limit,
        total: filteredComments.length,
        totalPages: Math.ceil(filteredComments.length / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    const newComment = {
      id: Date.now().toString(),
      ...validatedData,
      author: validatedData.author || {
        name: "Anonymous User",
        email: "anonymous@example.com"
      },
      createdAt: new Date(),
      status: "pending",
      replies: []
    };

    comments.push(newComment);

    return NextResponse.json({
      success: true,
      data: newComment,
      message: "Comment created successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// PUT /api/comments - Update comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateCommentSchema.parse(updateData);
    const commentIndex = comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    comments[commentIndex] = {
      ...comments[commentIndex],
      ...validatedData
    };

    return NextResponse.json({
      success: true,
      data: comments[commentIndex],
      message: "Comment updated successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/comments - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const commentIndex = comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const deletedComment = comments[commentIndex];
    comments.splice(commentIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedComment,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}