'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Clock, 
  Eye, 
  Search,
  Filter,
  BookOpen,
  Monitor,
  Headphones,
  FileText,
  Download,
  Share2,
  Heart,
  MessageSquare,
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  views: number
  rating: number
  instructor: string
  topics: string[]
  resources: {
    type: 'pdf' | 'link' | 'code'
    title: string
    url: string
  }[]
  transcript?: string
}

const videoTutorials: VideoTutorial[] = [
  {
    id: 'cms-overview',
    title: '5CMS Complete Overview',
    description: 'A comprehensive tour of all 5CMS features and capabilities. Perfect for new users wanting to understand the full scope of the platform.',
    duration: '15:42',
    thumbnail: '/api/placeholder/400/225',
    category: 'Introduction',
    difficulty: 'Beginner',
    views: 1250,
    rating: 4.8,
    instructor: 'Sarah Johnson',
    topics: ['Dashboard', 'Navigation', 'Features', 'Getting Started'],
    resources: [
      {
        type: 'pdf',
        title: '5CMS Feature Checklist',
        url: '/resources/feature-checklist.pdf'
      },
      {
        type: 'link',
        title: 'Interactive Demo',
        url: '/demo'
      }
    ]
  },
  {
    id: 'content-creation',
    title: 'Creating Amazing Content',
    description: 'Learn the complete workflow of creating, editing, and publishing content in 5CMS. Includes best practices and pro tips.',
    duration: '22:15',
    thumbnail: '/api/placeholder/400/225',
    category: 'Content Creation',
    difficulty: 'Beginner',
    views: 890,
    rating: 4.9,
    instructor: 'Mike Chen',
    topics: ['Content Editor', 'Media Upload', 'Publishing', 'Drafts'],
    resources: [
      {
        type: 'pdf',
        title: 'Content Creation Guide',
        url: '/resources/content-guide.pdf'
      },
      {
        type: 'code',
        title: 'Content Templates',
        url: '/resources/templates'
      }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI-Powered Content Tools',
    description: 'Discover how to leverage AI features to enhance your content creation process and improve quality.',
    duration: '18:30',
    thumbnail: '/api/placeholder/400/225',
    category: 'AI Tools',
    difficulty: 'Intermediate',
    views: 756,
    rating: 4.7,
    instructor: 'Dr. Emily Watson',
    topics: ['AI Writing', 'SEO Optimization', 'Content Analysis', 'Smart Suggestions'],
    resources: [
      {
        type: 'pdf',
        title: 'AI Tools Guide',
        url: '/resources/ai-guide.pdf'
      },
      {
        type: 'link',
        title: 'AI Playground',
        url: '/ai-playground'
      }
    ]
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration Workflow',
    description: 'Master the collaboration features in 5CMS to work effectively with your team and streamline content approval.',
    duration: '25:20',
    thumbnail: '/api/placeholder/400/225',
    category: 'Collaboration',
    difficulty: 'Intermediate',
    views: 623,
    rating: 4.6,
    instructor: 'Alex Rivera',
    topics: ['Team Roles', 'Comments', 'Version Control', 'Approval Workflow'],
    resources: [
      {
        type: 'pdf',
        title: 'Collaboration Playbook',
        url: '/resources/collaboration.pdf'
      },
      {
        type: 'link',
        title: 'Workflow Templates',
        url: '/resources/workflows'
      }
    ]
  },
  {
    id: 'seo-mastery',
    title: 'SEO Optimization Mastery',
    description: 'Advanced techniques for optimizing your content for search engines and improving organic traffic.',
    duration: '32:45',
    thumbnail: '/api/placeholder/400/225',
    category: 'SEO',
    difficulty: 'Advanced',
    views: 445,
    rating: 4.9,
    instructor: 'David Kim',
    topics: ['Keyword Research', 'Meta Tags', 'Content Structure', 'Analytics'],
    resources: [
      {
        type: 'pdf',
        title: 'SEO Checklist',
        url: '/resources/seo-checklist.pdf'
      },
      {
        type: 'code',
        title: 'SEO Templates',
        url: '/resources/seo-templates'
      }
    ]
  },
  {
    id: 'advanced-features',
    title: 'Advanced Features & Customization',
    description: 'Deep dive into advanced features, custom workflows, and integration possibilities for power users.',
    duration: '28:10',
    thumbnail: '/api/placeholder/400/225',
    category: 'Advanced',
    difficulty: 'Advanced',
    views: 312,
    rating: 4.8,
    instructor: 'Lisa Thompson',
    topics: ['Custom Fields', 'API Integration', 'Workflows', 'Security'],
    resources: [
      {
        type: 'pdf',
        title: 'Advanced Features Guide',
        url: '/resources/advanced-guide.pdf'
      },
      {
        type: 'code',
        title: 'API Documentation',
        url: '/resources/api-docs'
      }
    ]
  }
]

const categories = ['All', 'Introduction', 'Content Creation', 'AI Tools', 'Collaboration', 'SEO', 'Advanced']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function VideoTutorials() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

  const filteredVideos = videoTutorials.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || video.difficulty === selectedDifficulty
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const formatDuration = (duration: string) => {
    return duration
  }

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedVideo(null)}>
              ← Back to Videos
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src={selectedVideo.thumbnail} 
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white/90 hover:bg-white text-black">
                        <Play className="h-6 w-6 mr-2" />
                        Play Video
                      </Button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {selectedVideo.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Information */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{selectedVideo.title}</CardTitle>
                      <p className="text-gray-600 mt-2">{selectedVideo.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{formatViews(selectedVideo.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{selectedVideo.rating} rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <Badge variant={selectedVideo.difficulty === 'Beginner' ? 'secondary' : 
                                   selectedVideo.difficulty === 'Intermediate' ? 'default' : 'destructive'}>
                      {selectedVideo.difficulty}
                    </Badge>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Instructor</h3>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {selectedVideo.instructor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedVideo.instructor}</p>
                        <p className="text-sm text-gray-600">5CMS Expert</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.topics.map(topic => (
                        <Badge key={topic} variant="outline">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedVideo.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {resource.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
                        {resource.type === 'link' && <ExternalLink className="h-4 w-4 text-blue-500" />}
                        {resource.type === 'code' && <Monitor className="h-4 w-4 text-green-500" />}
                        <span className="text-sm font-medium">{resource.title}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Transcript */}
              {selectedVideo.transcript && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto text-sm text-gray-600">
                      <p>Video transcript would be available here...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videoTutorials
                    .filter(v => v.id !== selectedVideo.id && v.category === selectedVideo.category)
                    .slice(0, 3)
                    .map(video => (
                      <div 
                        key={video.id} 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <img src={video.thumbnail} alt={video.title} className="w-20 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                          <p className="text-xs text-gray-500">{video.duration}</p>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Tutorials</h1>
          <p className="mt-2 text-gray-600">Learn from expert instructors with comprehensive video guides</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search videos, topics, or instructors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Monitor className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{videoTutorials.length}</p>
                  <p className="text-sm text-gray-600">Total Videos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">2.5h</p>
                  <p className="text-sm text-gray-600">Total Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Eye className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatViews(videoTutorials.reduce((sum, v) => sum + v.views, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div onClick={() => setSelectedVideo(video)}>
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant={video.difficulty === 'Beginner' ? 'secondary' : 
                                   video.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                                    className="text-xs">
                      {video.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{video.rating}</span>
                    </div>
                    <span>{video.category}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-medium">
                          {video.instructor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">{video.instructor}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}