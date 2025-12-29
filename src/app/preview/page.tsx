"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  BarChart3, 
  Edit3, 
  Users, 
  Settings, 
  Shield,
  Zap,
  Search,
  Image,
  MessageSquare,
  Eye,
  Lock,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Award,
  BookOpen
} from "lucide-react";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview Mode
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  v2.0.1
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">5CMS - Content Management System</h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl">
                A powerful, AI-powered content management system designed for modern teams. 
                Experience the future of content creation and management.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In to Access Full Version
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm text-blue-100">Features</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Modern Teams</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From AI-powered content creation to advanced analytics, 5CMS has everything you need to manage your content effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Rich Content Editor</CardTitle>
              </div>
              <CardDescription>
                Advanced WYSIWYG editor with AI-powered suggestions and real-time collaboration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Visual editing with live preview</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI content suggestions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Version control & history</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">AI-Powered Tools</CardTitle>
              </div>
              <CardDescription>
                Leverage artificial intelligence for content optimization, SEO, and automation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Smart content generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>SEO optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Automated tagging</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Advanced Analytics</CardTitle>
              </div>
              <CardDescription>
                Comprehensive insights into content performance and user engagement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time traffic data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Content performance metrics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom reports</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
              </div>
              <CardDescription>
                Work together seamlessly with advanced collaboration and workflow features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time collaboration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Approval workflows</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Role-based permissions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="text-lg">Enterprise Security</CardTitle>
              </div>
              <CardDescription>
                Bank-level security with advanced authentication and data protection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Multi-factor authentication</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Audit logging</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Settings className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Customizable & Extensible</CardTitle>
              </div>
              <CardDescription>
                Flexible system that adapts to your unique workflows and requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom workflows</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>API integrations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Plugin architecture</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience the Interface</h2>
            <p className="text-gray-600">Get a glimpse of the modern, intuitive interface</p>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">Dashboard Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Content</p>
                        <p className="text-2xl font-bold">247</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Page Views</p>
                        <p className="text-2xl font-bold">45.2K</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">Content Editor</h3>
                <div className="bg-white rounded border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <Button variant="ghost" size="sm">B</Button>
                    <Button variant="ghost" size="sm">I</Button>
                    <Button variant="ghost" size="sm">U</Button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <Button variant="ghost" size="sm">H1</Button>
                    <Button variant="ghost" size="sm">H2</Button>
                    <Button variant="ghost" size="sm">H3</Button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <Button variant="ghost" size="sm">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="min-h-[200px] text-gray-500">
                    Start typing your content here... AI suggestions will appear as you write.
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium mb-2">Traffic Overview</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Organic Search</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Direct Traffic</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Social Media</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium mb-2">Top Content</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Getting Started Guide</span>
                        <span className="font-medium">12.5K views</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Best Practices</span>
                        <span className="font-medium">8.3K views</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>API Documentation</span>
                        <span className="font-medium">6.7K views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">Settings & Configuration</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="font-medium mb-2">General Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-save</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Notifications</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Two-Factor Auth</span>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Content Management?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of teams who have already switched to 5CMS for better content management, 
            improved collaboration, and enhanced productivity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Lock className="h-4 w-4 mr-2" />
              Sign In to Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Star className="h-4 w-4 mr-2" />
              Request a Demo
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 5CMS. All rights reserved.</p>
            <p className="text-sm mt-2">
              This is a preview version. Sign in to access the full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}