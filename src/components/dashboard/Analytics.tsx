// src/components/dashboard/Analytics.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, FileText, Eye } from "lucide-react";
import Image from "next/image";

// --- FIX 1: Add a simple loader for next/image for static exports ---
// This tells Next.js to just use the src path as-is for static builds.
const imageLoader = ({ src }: { src: string }) => src;

const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: This API call will fail on static GitHub Pages deployment
      const response = await fetch("/api/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- FIX 2: Make useEffect more robust for static builds ---
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    fetchAnalytics();
  };

  const metrics = [
    {
      title: "Total Views",
      value: data?.totalViews || "12,543",
      change: "+12.5%",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: data?.totalUsers || "1,893",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Content Items",
      value: data?.contentItems || "342",
      change: "+15.3%",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Engagement Rate",
      value: data?.engagementRate || "68.4%",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {loading && <p>Loading analytics data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{metric.change}</span> from last
                    month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="relative h-[200px] w-full flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for chart */}
                  <div className="text-center">
                    <Image
                      loader={imageLoader}
                      src="/placeholder-chart.svg"
                      alt="Traffic Chart Placeholder"
                      width={150}
                      height={100}
                      className="mb-2"
                    />
                    <p className="text-sm">Traffic chart will be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="relative h-[200px] w-full flex items-center justify-center text-muted-foreground">
                  {/* Placeholder for chart */}
                  <div className="text-center">
                    <Image
                      loader={imageLoader}
                      src="/placeholder-chart.svg"
                      alt="Device Chart Placeholder"
                      width={150}
                      height={100}
                      className="mb-2"
                    />
                    <p className="text-sm">Device chart will be rendered here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;