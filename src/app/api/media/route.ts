import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock media data - in real app, this would come from database and file system
let mediaItems = [
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    size: 245760,
    url: "/api/media/hero-banner.jpg",
    thumbnail: "/api/media/thumbnails/hero-banner.jpg",
    alt: "Hero banner for homepage",
    caption: "Main hero banner featuring the 5CMS platform",
    tags: ["banner", "hero", "homepage"],
    uploadedBy: "John Doe",
    uploadedAt: new Date("2024-01-15"),
    metadata: {
      width: 1920,
      height: 1080,
      format: "JPEG",
      colorSpace: "RGB"
    }
  },
  {
    id: "2",
    name: "cms-dashboard.png",
    type: "image",
    size: 156789,
    url: "/api/media/cms-dashboard.png",
    thumbnail: "/api/media/thumbnails/cms-dashboard.png",
    alt: "CMS Dashboard screenshot",
    caption: "Screenshot of the 5CMS dashboard interface",
    tags: ["screenshot", "dashboard", "ui"],
    uploadedBy: "Jane Smith",
    uploadedAt: new Date("2024-01-18"),
    metadata: {
      width: 1440,
      height: 900,
      format: "PNG",
      colorSpace: "RGB"
    }
  },
  {
    id: "3",
    name: "intro-video.mp4",
    type: "video",
    size: 5242880,
    url: "/api/media/intro-video.mp4",
    thumbnail: "/api/media/thumbnails/intro-video.jpg",
    alt: "5CMS Introduction video",
    caption: "Introduction video showcasing 5CMS features",
    tags: ["video", "intro", "tutorial"],
    uploadedBy: "Mike Johnson",
    uploadedAt: new Date("2024-01-20"),
    metadata: {
      duration: 180, // seconds
      format: "MP4",
      resolution: "1920x1080",
      bitrate: "2.5 Mbps"
    }
  },
  {
    id: "4",
    name: "brand-guidelines.pdf",
    type: "document",
    size: 892456,
    url: "/api/media/brand-guidelines.pdf",
    thumbnail: "/api/media/thumbnails/brand-guidelines.jpg",
    alt: "Brand guidelines document",
    caption: "Official 5CMS brand guidelines and usage rules",
    tags: ["document", "brand", "guidelines"],
    uploadedBy: "Sarah Wilson",
    uploadedAt: new Date("2024-01-22"),
    metadata: {
      format: "PDF",
      pages: 24,
      author: "5CMS Team"
    }
  }
];

const uploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: z.enum(["image", "video", "document", "audio"]).default("image"),
  alt: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([])
});

const updateMediaSchema = z.object({
  name: z.string().min(1, "File name is required").optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// GET /api/media - List all media
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const tags = searchParams.get('tags') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredMedia = mediaItems;

    // Apply search filter
    if (search) {
      filteredMedia = filteredMedia.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.alt?.toLowerCase().includes(search.toLowerCase()) ||
        item.caption?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (type !== 'all') {
      filteredMedia = filteredMedia.filter(item => item.type === type);
    }

    // Apply tags filter
    if (tags) {
      const searchTags = tags.toLowerCase().split(',');
      filteredMedia = filteredMedia.filter(item =>
        item.tags.some(tag => searchTags.includes(tag.toLowerCase()))
      );
    }

    // Sort by upload date (newest first)
    filteredMedia.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMedia = filteredMedia.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedMedia,
      pagination: {
        page,
        limit,
        total: filteredMedia.length,
        totalPages: Math.ceil(filteredMedia.length / limit)
      },
      stats: {
        totalItems: mediaItems.length,
        totalSize: mediaItems.reduce((sum, item) => sum + item.size, 0),
        byType: {
          image: mediaItems.filter(item => item.type === 'image').length,
          video: mediaItems.filter(item => item.type === 'video').length,
          document: mediaItems.filter(item => item.type === 'document').length,
          audio: mediaItems.filter(item => item.type === 'audio').length
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "File type not allowed" },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size exceeds limit" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Save the file to storage (local, S3, etc.)
    // 2. Generate thumbnail for images/videos
    // 3. Extract metadata
    // 4. Store in database

    // For now, we'll simulate the upload
    const newMediaItem = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      url: `/api/media/${file.name}`,
      thumbnail: `/api/media/thumbnails/${file.name}`,
      alt: metadata.alt || file.name,
      caption: metadata.caption || '',
      tags: metadata.tags || [],
      uploadedBy: "Current User",
      uploadedAt: new Date(),
      metadata: {
        format: file.type,
        originalName: file.name
      }
    };

    mediaItems.push(newMediaItem);

    return NextResponse.json({
      success: true,
      data: newMediaItem,
      message: "File uploaded successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// PUT /api/media - Update media metadata
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateMediaSchema.parse(updateData);
    const mediaIndex = mediaItems.findIndex(item => item.id === id);

    if (mediaIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    mediaItems[mediaIndex] = {
      ...mediaItems[mediaIndex],
      ...validatedData
    };

    return NextResponse.json({
      success: true,
      data: mediaItems[mediaIndex],
      message: "Media updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update media" },
      { status: 500 }
    );
  }
}

// DELETE /api/media - Delete media
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media ID is required" },
        { status: 400 }
      );
    }

    const mediaIndex = mediaItems.findIndex(item => item.id === id);

    if (mediaIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 }
      );
    }

    const deletedMedia = mediaItems[mediaIndex];
    mediaItems.splice(mediaIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedMedia,
      message: "Media deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete media" },
      { status: 500 }
    );
  }
}