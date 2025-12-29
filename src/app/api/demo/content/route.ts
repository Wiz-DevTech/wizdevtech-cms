import { NextRequest, NextResponse } from "next/server";

// Demo data for preview mode
const demoContent = [
  {
    id: "1",
    title: "Getting Started with 5CMS",
    slug: "getting-started",
    excerpt: "Learn how to set up and start using 5CMS for your content management needs.",
    content: "Welcome to 5CMS! This comprehensive guide will walk you through everything you need to know to get started with our powerful content management system.",
    status: "published",
    publishedAt: "2024-01-15T10:00:00Z",
    author: "John Doe",
    category: "Documentation",
    tags: ["tutorial", "getting-started", "cms"],
    featuredImage: "/images/demo-content-1.jpg",
    seoTitle: "Getting Started with 5CMS - Complete Guide",
    seoDescription: "Learn how to set up and start using 5CMS for your content management needs.",
    readingTime: 5,
    views: 1250,
    likes: 45,
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Advanced AI Features",
    slug: "advanced-ai-features",
    excerpt: "Explore the powerful AI capabilities that make 5CMS stand out from the competition.",
    content: "5CMS leverages cutting-edge artificial intelligence to help you create better content faster. Our AI tools include content generation, SEO optimization, and smart suggestions.",
    status: "published",
    publishedAt: "2024-01-14T14:30:00Z",
    author: "Jane Smith",
    category: "Features",
    tags: ["ai", "features", "automation"],
    featuredImage: "/images/demo-content-2.jpg",
    seoTitle: "Advanced AI Features in 5CMS",
    seoDescription: "Explore the powerful AI capabilities that make 5CMS stand out from the competition.",
    readingTime: 8,
    views: 890,
    likes: 32,
    createdAt: "2024-01-14T13:45:00Z",
    updatedAt: "2024-01-14T14:30:00Z"
  },
  {
    id: "3",
    title: "Team Collaboration Guide",
    slug: "team-collaboration-guide",
    excerpt: "Best practices for collaborating with your team using 5CMS workflow features.",
    content: "Effective team collaboration is crucial for content success. 5CMS provides comprehensive tools for teams to work together seamlessly, including real-time editing, approval workflows, and role-based permissions.",
    status: "draft",
    publishedAt: null,
    author: "Mike Johnson",
    category: "Best Practices",
    tags: ["collaboration", "team", "workflow"],
    featuredImage: "/images/demo-content-3.jpg",
    seoTitle: "Team Collaboration Guide - 5CMS",
    seoDescription: "Best practices for collaborating with your team using 5CMS workflow features.",
    readingTime: 6,
    views: 567,
    likes: 28,
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T16:45:00Z"
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  // Filter content based on query parameters
  let filteredContent = demoContent;

  if (status) {
    filteredContent = filteredContent.filter(item => item.status === status);
  }

  if (category) {
    filteredContent = filteredContent.filter(item => 
      item.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (search) {
    filteredContent = filteredContent.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: {
      content: paginatedContent,
      pagination: {
        page,
        limit,
        total: filteredContent.length,
        totalPages: Math.ceil(filteredContent.length / limit),
        hasNext: endIndex < filteredContent.length,
        hasPrev: page > 1
      },
      filters: {
        status,
        category,
        search
      }
    },
    message: "Demo content loaded successfully"
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: false,
    message: "Content creation is disabled in demo mode. Please sign in to access full functionality."
  }, { status: 403 });
}