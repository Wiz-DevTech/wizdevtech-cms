import { NextRequest, NextResponse } from "next/server";

// Demo analytics data
const demoAnalytics = {
  overview: {
    totalContent: 247,
    publishedContent: 189,
    draftContent: 58,
    totalUsers: 12,
    activeUsers: 8,
    totalViews: 45234,
    monthlyViews: 12450,
    averageReadingTime: 4.5,
    engagementRate: 68.2
  },
  traffic: {
    sources: [
      { source: "Organic Search", value: 45, change: 12.5 },
      { source: "Direct Traffic", value: 30, change: -5.2 },
      { source: "Social Media", value: 15, change: 8.7 },
      { source: "Referral", value: 7, change: 3.1 },
      { source: "Email", value: 3, change: -2.3 }
    ],
    devices: [
      { device: "Desktop", value: 65, change: 2.1 },
      { device: "Mobile", value: 28, change: 15.3 },
      { device: "Tablet", value: 7, change: -8.5 }
    ],
    pages: [
      { page: "/getting-started", views: 1250, unique: 890, bounceRate: 32.5 },
      { page: "/features", views: 980, unique: 720, bounceRate: 28.1 },
      { page: "/pricing", views: 756, unique: 540, bounceRate: 41.2 },
      { page: "/documentation", views: 623, unique: 489, bounceRate: 25.8 },
      { page: "/blog", views: 545, unique: 412, bounceRate: 35.6 }
    ]
  },
  content: {
    topPerforming: [
      { title: "Getting Started with 5CMS", views: 1250, likes: 45, comments: 12, shares: 8 },
      { title: "Advanced AI Features", views: 890, likes: 32, comments: 8, shares: 5 },
      { title: "Team Collaboration Guide", views: 567, likes: 28, comments: 6, shares: 3 },
      { title: "SEO Best Practices", views: 445, likes: 22, comments: 4, shares: 2 },
      { title: "API Documentation", views: 389, likes: 18, comments: 9, shares: 4 }
    ],
    categories: [
      { category: "Documentation", count: 45, views: 8900 },
      { category: "Features", count: 32, views: 6700 },
      { category: "Tutorials", count: 28, views: 5400 },
      { category: "Best Practices", count: 21, views: 3200 },
      { category: "News", count: 18, views: 2100 }
    ]
  },
  timeline: [
    { date: "2024-01-15", views: 450, users: 89, content: 3 },
    { date: "2024-01-14", views: 380, users: 76, content: 2 },
    { date: "2024-01-13", views: 520, users: 98, content: 5 },
    { date: "2024-01-12", views: 490, users: 87, content: 4 },
    { date: "2024-01-11", views: 410, users: 72, content: 1 }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  type = searchParams.get("type") || "overview";
  const period = searchParams.get("period") || "7d";

  // Simulate different data based on period
  const multiplier = period === "30d" ? 4.3 : period === "90d" ? 12.8 : 1;

  let data = demoAnalytics[type as keyof typeof demoAnalytics];

  // Apply multiplier for numeric values
  if (type === "overview" && typeof data === "object") {
    data = { ...data };
    Object.keys(data).forEach(key => {
      if (typeof data[key as keyof typeof data] === "number") {
        data[key as keyof typeof data] = Math.round(data[key as keyof typeof data] * multiplier);
      }
    });
  }

  return NextResponse.json({
    success: true,
    data,
    period,
    type,
    message: "Demo analytics data loaded successfully"
  });
}