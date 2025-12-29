"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Clock, 
  Calendar, 
  TrendingUp,
  Users,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Eye,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";
import { ContentMetrics, EngagementMetrics, ContentPerformance } from "./Metrics";
import { AnalyticsDashboard } from "./Analytics";

interface DashboardProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'user' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'success' | 'warning' | 'error';
}

interface QuickStats {
  totalContent: number;
  publishedToday: number;
  pendingReview: number;
  totalUsers: number;
  activeUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const quickStats: QuickStats = {
    totalContent: 1247,
    publishedToday: 8,
    pendingReview: 23,
    totalUsers: 15420,
    activeUsers: 892,
    systemHealth: 'healthy'
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'post',
      title: 'New blog post published',
      description: 'Getting Started with AI in Content Management',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'success'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment on post',
      description: 'Great insights on modern web development!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'success'
    },
    {
      id: '3',
      type: 'user',
      title: 'New user registered',
      description: 'john.doe@example.com joined the platform',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'success'
    },
    {
      id: '4',
      type: 'system',
      title: 'System update completed',
      description: 'CMS updated to version 2.4.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'success'
    },
    {
      id: '5',
      type: 'post',
      title: 'Post requires review',
      description: 'Advanced SEO Strategies needs editorial review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'warning'
    }
  ];

  const contentMetrics = {
    totalPosts: quickStats.totalContent,
    publishedPosts: 892,
    draftPosts: 234,
    scheduledPosts: 121,
    totalWords: 1245000,
    avgWordCount: 1250
  };

  const engagementMetrics = {
    totalViews: 456780,
    uniqueVisitors: 89234,
    avgTimeOnPage: 245, // seconds
    bounceRate: 34,
    socialShares: 12450,
    comments: 3420
  };

  const contentPerformance = [
    {
      id: '1',
      title: 'Getting Started with AI in Content Management',
      views: 12450,
      shares: 234,
      comments: 89,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      status: 'published' as const,
      score: 92
    },
    {
      id: '2',
      title: 'Modern Web Development Best Practices',
      views: 10230,
      shares: 189,
      comments: 67,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      status: 'published' as const,
      score: 88
    },
    {
      id: '3',
      title: 'SEO Strategies for 2024',
      views: 9870,
      shares: 156,
      comments: 45,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      status: 'published' as const,
      score: 85
    }
  ];

  const analyticsData = {
    pageViews: [
      { date: '2024-01-01', views: 4000, unique: 1200 },
      { date: '2024-01-02', views: 3000, unique: 1000 },
      { date: '2024-01-03', views: 5000, unique: 1500 },
      { date: '2024-01-04', views: 2780, unique: 900 },
      { date: '2024-01-05', views: 6890, unique: 2000 },
      { date: '2024-01-06', views: 7390, unique: 2200 },
      { date: '2024-01-07', views: 5490, unique: 1700 }
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
    ]
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      post: <FileText className="h-4 w-4" />,
      comment: <MessageSquare className="h-4 w-4" />,
      user: <Users className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getStatusIcon = (status?: string) => {
    const icons = {
      success: <CheckCircle className="h-3 w-3 text-green-500" />,
      warning: <AlertCircle className="h-3 w-3 text-yellow-500" />,
      error: <AlertCircle className="h-3 w-3 text-red-500" />
    };
    return icons[status as keyof typeof icons] || null;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your content today.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.totalContent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.publishedToday}</div>
            <p className="text-xs text-muted-foreground">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">
              5 urgent items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +18% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getSystemHealthColor(quickStats.systemHealth)}>
                {quickStats.systemHealth}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ContentMetrics {...contentMetrics} />
              <ContentPerformance posts={contentPerformance} />
            </div>
            <div className="space-y-6">
              <EngagementMetrics {...engagementMetrics} />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates across your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium line-clamp-1">
                                {activity.title}
                              </p>
                              {getStatusIcon(activity.status)}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimestamp(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6">
            <ContentMetrics {...contentMetrics} />
            <ContentPerformance posts={contentPerformance} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard 
            data={analyticsData}
            onRefresh={() => console.log('Refreshing analytics...')}
            onExport={() => console.log('Exporting analytics...')}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Complete activity log for your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          {getStatusIcon(activity.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}