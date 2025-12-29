'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import InteractiveTutorial from '@/components/training/InteractiveTutorial'
import VideoTutorials from '@/components/training/VideoTutorials'
import ProgressTracking from '@/components/training/ProgressTracking'
import QuickReference from '@/components/training/QuickReference'
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  Zap,
  Award,
  PlayCircle,
  Download,
  Search,
  HelpCircle,
  Lightbulb,
  Target,
  Rocket,
  Settings,
  PenTool,
  BarChart3,
  Shield,
  MessageSquare,
  Image,
  Database,
  Globe
} from 'lucide-react'

interface TrainingModule {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  progress: number
  completed: boolean
  icon: React.ReactNode
  topics: string[]
  prerequisites?: string[]
}

const trainingModules: TrainingModule[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with 5CMS',
    description: 'Learn the basics of navigating the 5CMS interface and understanding the core concepts.',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'Foundation',
    progress: 0,
    completed: false,
    icon: <Rocket className="h-6 w-6" />,
    topics: ['Dashboard Overview', 'Navigation Basics', 'User Profile', 'Basic Settings'],
    prerequisites: []
  },
  {
    id: 'content-creation',
    title: 'Creating and Managing Content',
    description: 'Master the art of creating, editing, and organizing content in 5CMS.',
    duration: '25 min',
    difficulty: 'Beginner',
    category: 'Content Management',
    progress: 0,
    completed: false,
    icon: <PenTool className="h-6 w-6" />,
    topics: ['Creating New Content', 'Rich Text Editor', 'Media Upload', 'Content Organization'],
    prerequisites: ['getting-started']
  },
  {
    id: 'ai-powered-features',
    title: 'AI-Powered Content Creation',
    description: 'Leverage AI tools to enhance your content creation workflow and improve quality.',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'AI Tools',
    progress: 0,
    completed: false,
    icon: <Lightbulb className="h-6 w-6" />,
    topics: ['AI Content Generation', 'SEO Optimization', 'Content Analysis', 'Smart Suggestions'],
    prerequisites: ['content-creation']
  },
  {
    id: 'workflow-collaboration',
    title: 'Workflow and Collaboration',
    description: 'Learn how to work effectively with your team using 5CMS collaboration features.',
    duration: '30 min',
    difficulty: 'Intermediate',
    category: 'Team Work',
    progress: 0,
    completed: false,
    icon: <Users className="h-6 w-6" />,
    topics: ['Team Roles', 'Content Approval', 'Comments & Feedback', 'Version Control'],
    prerequisites: ['content-creation']
  },
  {
    id: 'analytics-seo',
    title: 'Analytics and SEO Optimization',
    description: 'Understand how to track performance and optimize content for search engines.',
    duration: '35 min',
    difficulty: 'Advanced',
    category: 'Analytics',
    progress: 0,
    completed: false,
    icon: <BarChart3 className="h-6 w-6" />,
    topics: ['Performance Metrics', 'SEO Tools', 'Content Insights', 'Reporting'],
    prerequisites: ['ai-powered-features']
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features and Customization',
    description: 'Explore advanced features and customization options for power users.',
    duration: '40 min',
    difficulty: 'Advanced',
    category: 'Advanced',
    progress: 0,
    completed: false,
    icon: <Settings className="h-6 w-6" />,
    topics: ['Custom Workflows', 'API Integration', 'Advanced Settings', 'Security Features'],
    prerequisites: ['workflow-collaboration']
  }
]

const quickGuides = [
  {
    title: 'Quick Start Guide',
    description: 'Get up and running in 5 minutes',
    icon: <Zap className="h-5 w-5" />,
    link: '#quick-start'
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Boost your productivity with shortcuts',
    icon: <FileText className="h-5 w-5" />,
    link: '#shortcuts'
  },
  {
    title: 'Content Templates',
    description: 'Use templates for consistent content',
    icon: <Database className="h-5 w-5" />,
    link: '#templates'
  },
  {
    title: 'SEO Best Practices',
    description: 'Optimize your content for search',
    icon: <Globe className="h-5 w-5" />,
    link: '#seo'
  }
]

const videoTutorials = [
  {
    title: '5CMS Overview Tour',
    duration: '8:42',
    thumbnail: '/api/placeholder/320/180',
    category: 'Introduction'
  },
  {
    title: 'Creating Your First Article',
    duration: '12:15',
    thumbnail: '/api/placeholder/320/180',
    category: 'Content Creation'
  },
  {
    title: 'AI Content Generation',
    duration: '10:30',
    thumbnail: '/api/placeholder/320/180',
    category: 'AI Tools'
  },
  {
    title: 'Team Collaboration Guide',
    duration: '15:20',
    thumbnail: '/api/placeholder/320/180',
    category: 'Collaboration'
  }
]

export default function TrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredModules = trainingModules.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['all', ...Array.from(new Set(trainingModules.map(m => m.category)))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">5CMS Training Center</h1>
              <p className="mt-2 text-gray-600">Master the power of 5CMS with comprehensive training resources</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Award className="h-4 w-4 mr-1" />
                Certification Available
              </Badge>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Resources
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Your Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">0%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0/6</div>
                <div className="text-sm text-gray-600">Modules Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">0h 0m</div>
                <div className="text-sm text-gray-600">Time Invested</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="modules">Learning Modules</TabsTrigger>
            <TabsTrigger value="interactive">Interactive</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="guides">Quick Guides</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="certification">Certification</TabsTrigger>
          </TabsList>

          {/* Learning Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search training modules..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Training Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={module.difficulty === 'Beginner' ? 'secondary' : 
                                          module.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                              {module.difficulty}
                            </Badge>
                            <span className="text-sm text-gray-500">{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {module.description}
                    </CardDescription>
                    
                    {module.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Topics covered:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.topics.map(topic => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {module.prerequisites && module.prerequisites.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Prerequisites:</h4>
                        <div className="text-xs text-gray-600">
                          {module.prerequisites.map(prereq => {
                            const prereqModule = trainingModules.find(m => m.id === prereq)
                            return prereqModule ? prereqModule.title : prereq
                          }).join(', ')}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      disabled={module.prerequisites && module.prerequisites.length > 0 && !module.prerequisites.every(prereq => 
                        trainingModules.find(m => m.id === prereq)?.completed
                      )}
                    >
                      {module.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Review Module
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Learning
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Interactive Tutorials Tab */}
          <TabsContent value="interactive" className="space-y-6">
            <InteractiveTutorial />
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="videos" className="space-y-6">
            <VideoTutorials />
          </TabsContent>

          {/* Quick Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <QuickReference />
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressTracking />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}