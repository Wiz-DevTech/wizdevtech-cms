"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  pageViews: Array<{ date: string; views: number; unique: number }>;
  trafficSources: Array<{ source: string; value: number; percentage: number }>;
  contentPerformance: Array<{
    title: string;
    views: number;
    engagement: number;
    shares: number;
  }>;
  deviceStats: Array<{ device: string; users: number; percentage: number }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function AnalyticsDashboard({ 
  data, 
  isLoading = false, 
  onRefresh, 
  onExport 
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [metric, setMetric] = useState('views');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatViews = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor your content performance and audience engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Traffic Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Overview
              </CardTitle>
              <CardDescription>
                Page views and unique visitors over time
              </CardDescription>
            </div>
            <Tabs value={metric} onValueChange={setMetric}>
              <TabsList>
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="unique">Unique</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatViews}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatViews(value), metric === 'views' ? 'Views' : 'Unique Visitors']}
                />
                <Line 
                  type="monotone" 
                  dataKey={metric} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources and Device Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your audience comes from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value} visits`, 'Traffic']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {data.trafficSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{source.source}</span>
                  </div>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Statistics</CardTitle>
            <CardDescription>How users access your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.deviceStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="device" />
                  <YAxis tickFormatter={formatViews} />
                  <Tooltip 
                    formatter={(value: number) => [formatViews(value), 'Users']}
                  />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {data.deviceStats.map((device) => (
                <div key={device.device} className="flex items-center justify-between text-sm">
                  <span>{device.device}</span>
                  <Badge variant="secondary">{device.percentage}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Performance
          </CardTitle>
          <CardDescription>
            Top performing content by views and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.contentPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatViews} />
                <YAxis 
                  dataKey="title" 
                  type="category" 
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const labels = {
                      views: 'Views',
                      engagement: 'Engagement Rate',
                      shares: 'Shares'
                    };
                    return [formatViews(value), labels[name as keyof typeof labels]];
                  }}
                />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}