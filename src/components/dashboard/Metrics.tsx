"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users, 
  Eye, 
  Clock,
  BarChart3,
  Activity,
  Calendar,
  Share2,
  MessageSquare
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  description?: string;
  icon: React.ReactNode;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  description, 
  icon, 
  color = 'default' 
}: MetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change.type === 'increase' 
      ? <TrendingUp className="h-3 w-3" />
      : <TrendingDown className="h-3 w-3" />;
  };

  return (
    <Card className={getColorClasses()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={`flex items-center text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1">
              {Math.abs(change.value)}% {change.period}
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface ContentMetricsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  totalWords: number;
  avgWordCount: number;
}

export function ContentMetrics({ 
  totalPosts, 
  publishedPosts, 
  draftPosts, 
  scheduledPosts, 
  totalWords, 
  avgWordCount 
}: ContentMetricsProps) {
  const publishedRate = totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Posts"
        value={totalPosts}
        change={{ value: 12, type: 'increase', period: 'this month' }}
        description="All content pieces"
        icon={<FileText />}
      />
      <MetricCard
        title="Published"
        value={publishedPosts}
        change={{ value: 8, type: 'increase', period: 'this month' }}
        description={`${publishedRate.toFixed(1)}% publish rate`}
        icon={<Eye />}
        color="success"
      />
      <MetricCard
        title="Drafts"
        value={draftPosts}
        description="In progress"
        icon={<Clock />}
        color="warning"
      />
      <MetricCard
        title="Scheduled"
        value={scheduledPosts}
        description="Queued for publish"
        icon={<Calendar />}
        color="default"
      />
    </div>
  );
}

interface EngagementMetricsProps {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  socialShares: number;
  comments: number;
}

export function EngagementMetrics({
  totalViews,
  uniqueVisitors,
  avgTimeOnPage,
  bounceRate,
  socialShares,
  comments
}: EngagementMetricsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Views"
        value={totalViews.toLocaleString()}
        change={{ value: 24, type: 'increase', period: 'this month' }}
        icon={<Eye />}
        color="success"
      />
      <MetricCard
        title="Unique Visitors"
        value={uniqueVisitors.toLocaleString()}
        change={{ value: 18, type: 'increase', period: 'this month' }}
        icon={<Users />}
      />
      <MetricCard
        title="Avg. Time on Page"
        value={formatTime(avgTimeOnPage)}
        change={{ value: 5, type: 'decrease', period: 'this month' }}
        icon={<Clock />}
        color="warning"
      />
      <MetricCard
        title="Bounce Rate"
        value={`${bounceRate}%`}
        change={{ value: 3, type: 'decrease', period: 'this month' }}
        icon={<Activity />}
        color="success"
      />
      <MetricCard
        title="Social Shares"
        value={socialShares.toLocaleString()}
        change={{ value: 45, type: 'increase', period: 'this month' }}
        icon={<Share2 />}
      />
      <MetricCard
        title="Comments"
        value={comments.toLocaleString()}
        change={{ value: 12, type: 'increase', period: 'this month' }}
        icon={<MessageSquare />}
      />
    </div>
  );
}

interface ContentPerformanceProps {
  posts: Array<{
    id: string;
    title: string;
    views: number;
    shares: number;
    comments: number;
    publishedAt: Date;
    status: 'published' | 'draft' | 'scheduled';
    score: number;
  }>;
}

export function ContentPerformance({ posts }: ContentPerformanceProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>
      {status}
    </Badge>;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const topPosts = posts
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Top Performing Content
        </CardTitle>
        <CardDescription>
          Your most viewed and engaged content pieces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium line-clamp-1">{post.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getStatusBadge(post.status)}
                    <span>•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {post.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {post.shares}
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {post.comments}
                </div>
                <Badge className={getScoreColor(post.score)}>
                  {post.score}
                </Badge>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content performance data available.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}