import { NextResponse } from "next/server";

// Mock analytics data
const analyticsData = {
  pageViews: [
    { date: '2024-01-15', views: 4000, unique: 1200 },
    { date: '2024-01-16', views: 3500, unique: 1100 },
    { date: '2024-01-17', views: 5000, unique: 1500 },
    { date: '2024-01-18', views: 4500, unique: 1400 },
    { date: '2024-01-19', views: 6000, unique: 1800 },
    { date: '2024-01-20', views: 5500, unique: 1700 },
    { date: '2024-01-21', views: 7000, unique: 2100 }
  ],
  trafficSources: [
    { source: 'Organic Search', value: 4000, percentage: 45 },
    { source: 'Direct', value: 2400, percentage: 27 },
    { source: 'Social Media', value: 1800, percentage: 20 },
    { source: 'Referral', value: 680, percentage: 8 }
  ],
  contentPerformance: [
    { title: 'AI in CMS', views: 12450, engagement: 85, shares: 234 },
    { title: 'Web Dev 2024', views: 10230, engagement: 78, shares: 189 },
    { title: 'SEO Strategies', views: 9870, engagement: 82, shares: 156 }
  ],
  deviceStats: [
    { device: 'Desktop', users: 5000, percentage: 60 },
    { device: 'Mobile', users: 3000, percentage: 35 },
    { device: 'Tablet', users: 500, percentage: 5 }
  ],
  summary: {
    totalViews: 456780,
    uniqueVisitors: 89234,
    avgTimeOnPage: 245,
    bounceRate: 34,
    socialShares: 12450,
    comments: 3420,
    totalPosts: 1247,
    publishedPosts: 892,
    draftPosts: 234,
    scheduledPosts: 121
  }
};

// GET /api/analytics - Get analytics data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}