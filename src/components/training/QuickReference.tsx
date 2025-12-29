'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search,
  Keyboard,
  MousePointer,
  FileText,
  Image,
  Settings,
  Zap,
  CheckCircle,
  Copy,
  Download,
  Printer,
  ExternalLink,
  HelpCircle,
  BookOpen,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Users,
  MessageSquare,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  Share2
} from 'lucide-react'

interface QuickGuide {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  content: {
    steps?: string[]
    shortcuts?: { key: string; description: string }[]
    tips?: string[]
    warnings?: string[]
    examples?: string[]
    links?: { title: string; url: string }[]
  }
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeToRead: string
}

const quickGuides: QuickGuide[] = [
  {
    id: 'keyboard-shortcuts',
    title: 'Essential Keyboard Shortcuts',
    description: 'Master the keyboard shortcuts to boost your productivity in 5CMS',
    category: 'Productivity',
    icon: <Keyboard className="h-6 w-6" />,
    content: {
      shortcuts: [
        { key: 'Ctrl + N', description: 'Create new content' },
        { key: 'Ctrl + S', description: 'Save current content' },
        { key: 'Ctrl + Z', description: 'Undo last action' },
        { key: 'Ctrl + Y', description: 'Redo last action' },
        { key: 'Ctrl + B', description: 'Bold text' },
        { key: 'Ctrl + I', description: 'Italic text' },
        { key: 'Ctrl + K', description: 'Insert link' },
        { key: 'Ctrl + Shift + P', description: 'Command palette' },
        { key: 'Ctrl + /', description: 'Toggle comments' },
        { key: 'Ctrl + Enter', description: 'Publish content' },
        { key: 'Ctrl + Shift + D', description: 'Save as draft' },
        { key: 'Ctrl + Alt + P', description: 'Preview content' }
      ],
      tips: [
        'Use Ctrl + Shift + P to quickly access any feature',
        'Keyboard shortcuts work in most text fields',
        'Custom shortcuts can be set in Settings > Keyboard'
      ]
    },
    difficulty: 'Beginner',
    timeToRead: '3 min'
  },
  {
    id: 'content-creation-quick',
    title: 'Quick Content Creation',
    description: 'Get your content published fast with this streamlined workflow',
    category: 'Content Creation',
    icon: <FileText className="h-6 w-6" />,
    content: {
      steps: [
        'Click "+ New Content" or press Ctrl + N',
        'Enter a compelling title (under 60 characters)',
        'Write your main content using the rich text editor',
        'Add relevant images and media',
        'Set SEO metadata (title, description, keywords)',
        'Choose appropriate category and tags',
        'Review using the preview feature',
        'Publish or schedule for later'
      ],
      tips: [
        'Use templates for consistent formatting',
        'AI assistant can help generate ideas',
        'Auto-save saves your work every 30 seconds',
        'Set a featured image for better engagement'
      ],
      warnings: [
        'Always check spelling and grammar before publishing',
        'Ensure all images have alt text for accessibility',
        'Verify all links are working before publishing'
      ]
    },
    difficulty: 'Beginner',
    timeToRead: '5 min'
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization Checklist',
    description: 'Essential SEO steps to ensure your content ranks well in search engines',
    category: 'SEO',
    icon: <Globe className="h-6 w-6" />,
    content: {
      steps: [
        'Research relevant keywords using the SEO tool',
        'Include primary keyword in title and first paragraph',
        'Write compelling meta description (150-160 characters)',
        'Use proper heading structure (H1, H2, H3)',
        'Optimize image alt text with keywords',
        'Build internal links to related content',
        'Set appropriate URL structure',
        'Add schema markup for rich snippets'
      ],
      tips: [
        'Focus on user intent, not just keywords',
        'Use long-tail keywords for better targeting',
        'Keep content comprehensive and valuable',
        'Regularly update and improve existing content'
      ],
      warnings: [
        'Avoid keyword stuffing - it hurts rankings',
        'Don\'t sacrifice readability for SEO',
        'Search engines prioritize user experience'
      ]
    },
    difficulty: 'Intermediate',
    timeToRead: '7 min'
  },
  {
    id: 'media-management',
    title: 'Media Management Best Practices',
    description: 'Efficiently manage and optimize your media files in 5CMS',
    category: 'Media',
    icon: <Image className="h-6 w-6" />,
    content: {
      steps: [
        'Upload images in web-optimized formats (WebP, JPEG)',
        'Compress images before uploading for faster loading',
        'Use descriptive file names (e.g., "blog-post-hero-image.jpg")',
        'Add comprehensive alt text for accessibility',
        'Organize media in folders by category or date',
        'Use appropriate image sizes for different contexts',
        'Regularly clean up unused media files'
      ],
      tips: [
        'Use the bulk upload feature for multiple files',
        'Create reusable templates for common image sizes',
        'Enable automatic image optimization in settings',
        'Use CDN for faster media delivery globally'
      ],
      warnings: [
        'Large images can slow down your website',
        'Always check image copyright before using',
        'Backup important media files regularly'
      ]
    },
    difficulty: 'Beginner',
    timeToRead: '4 min'
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration Workflow',
    description: 'Streamline your team\'s content creation and approval process',
    category: 'Collaboration',
    icon: <Users className="h-6 w-6" />,
    content: {
      steps: [
        'Define clear roles and permissions for team members',
        'Establish content approval workflows',
        'Use comments for feedback and discussions',
        'Set up notifications for important updates',
        'Create content style guides for consistency',
        'Use version control to track changes',
        'Schedule regular team sync meetings',
        'Document processes and best practices'
      ],
      tips: [
        'Use @mentions to notify specific team members',
        'Create templates for common content types',
        'Set up automated notifications for deadline reminders',
        'Use the activity feed to monitor progress'
      ],
      warnings: [
        'Too many approval stages can slow down publishing',
        'Ensure all team members understand the workflow',
        'Regular communication prevents misunderstandings'
      ]
    },
    difficulty: 'Intermediate',
    timeToRead: '6 min'
  },
  {
    id: 'ai-tools-guide',
    title: 'AI Tools Usage Guide',
    description: 'Leverage AI features to enhance your content creation process',
    category: 'AI Tools',
    icon: <Lightbulb className="h-6 w-6" />,
    content: {
      steps: [
        'Use AI content generation for initial drafts',
        'Leverage SEO suggestions for optimization',
        'Apply AI-powered grammar and style improvements',
        'Generate meta descriptions automatically',
        'Use AI to suggest related content ideas',
        'Analyze content performance with AI insights',
        'Generate social media snippets automatically'
      ],
      tips: [
        'Be specific in your AI prompts for better results',
        'Always review and edit AI-generated content',
        'Use AI suggestions as guidelines, not rules',
        'Combine AI insights with human creativity'
      ],
      warnings: [
        'AI content may lack originality and personal touch',
        'Always fact-check AI-generated information',
        'Don\'t rely solely on AI for important decisions'
      ]
    },
    difficulty: 'Intermediate',
    timeToRead: '5 min'
  },
  {
    id: 'security-best-practices',
    title: 'Security Best Practices',
    description: 'Keep your 5CMS secure and protect your content',
    category: 'Security',
    icon: <Shield className="h-6 w-6" />,
    content: {
      steps: [
        'Use strong, unique passwords for all accounts',
        'Enable two-factor authentication (2FA)',
        'Regularly update 5CMS and plugins',
        'Limit user permissions to necessary roles',
        'Regularly backup your content and database',
        'Monitor user activity logs',
        'Use HTTPS for secure connections',
        'Implement rate limiting for login attempts'
      ],
      tips: [
        'Use a password manager for secure password storage',
        'Educate team members about security best practices',
        'Regularly review and update user permissions',
        'Test your backup restoration process'
      ],
      warnings: [
        'Never share login credentials via email',
        'Avoid using public Wi-Fi for admin access',
        'Be cautious with third-party plugins and themes'
      ]
    },
    difficulty: 'Advanced',
    timeToRead: '8 min'
  },
  {
    id: 'analytics-basics',
    title: 'Analytics Basics',
    description: 'Understanding your content performance with 5CMS analytics',
    category: 'Analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    content: {
      steps: [
        'Set up Google Analytics integration',
        'Monitor page views and unique visitors',
        'Track average time on page',
        'Analyze bounce rates and exit pages',
        'Monitor conversion goals',
        'Review traffic sources and mediums',
        'Track content performance over time',
        'Use A/B testing for optimization'
      ],
      tips: [
        'Focus on metrics that align with your goals',
        'Set up custom dashboards for quick insights',
        'Regularly review and adjust your strategy',
        'Compare performance across different content types'
      ],
      warnings: [
        'Don\'t obsess over every metric - focus on what matters',
        'Correlation doesn\'t imply causation',
        'Consider seasonality and external factors'
      ]
    },
    difficulty: 'Intermediate',
    timeToRead: '6 min'
  }
]

const categories = ['All', 'Productivity', 'Content Creation', 'SEO', 'Media', 'Collaboration', 'AI Tools', 'Security', 'Analytics']

export default function QuickReference() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGuide, setSelectedGuide] = useState<QuickGuide | null>(null)
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null)

  const filteredGuides = quickGuides.filter(guide => {
    const matchesCategory = selectedCategory === 'All' || guide.category === selectedCategory
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedShortcut(text)
    setTimeout(() => setCopiedShortcut(null), 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-blue-100 text-blue-800'
      case 'Advanced': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedGuide(null)}>
              ← Back to Guides
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    {selectedGuide.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedGuide.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{selectedGuide.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                    {selectedGuide.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedGuide.timeToRead}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Steps */}
              {selectedGuide.content.steps && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Step-by-Step Instructions
                  </h3>
                  <ol className="space-y-3">
                    {selectedGuide.content.steps.map((step, index) => (
                      <li key={index} className="flex space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Shortcuts */}
              {selectedGuide.content.shortcuts && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Keyboard className="h-5 w-5 mr-2" />
                    Keyboard Shortcuts
                  </h3>
                  <div className="space-y-2">
                    {selectedGuide.content.shortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono">
                            {shortcut.key}
                          </kbd>
                          <span className="text-gray-700">{shortcut.description}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(shortcut.key)}
                        >
                          {copiedShortcut === shortcut.key ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {selectedGuide.content.tips && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Pro Tips
                  </h3>
                  <div className="space-y-2">
                    {selectedGuide.content.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Star className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-blue-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {selectedGuide.content.warnings && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Important Warnings
                  </h3>
                  <div className="space-y-2">
                    {selectedGuide.content.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span className="text-yellow-800">{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              {selectedGuide.content.examples && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Examples
                  </h3>
                  <div className="space-y-2">
                    {selectedGuide.content.examples.map((example, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {selectedGuide.content.links && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Related Resources
                  </h3>
                  <div className="space-y-2">
                    {selectedGuide.content.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-blue-600">{link.title}</span>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Guide
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quick Reference Guides</h1>
          <p className="mt-2 text-gray-600">Fast, actionable guides to help you master 5CMS features</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search guides, topics, or keywords..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{quickGuides.length}</p>
                  <p className="text-sm text-gray-600">Total Guides</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">5 min</p>
                  <p className="text-sm text-gray-600">Avg Read Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-gray-600">Shortcuts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">100+</p>
                  <p className="text-sm text-gray-600">Tips & Tricks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map(guide => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedGuide(guide)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {guide.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <p className="text-sm text-gray-600">{guide.category}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">{guide.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {guide.timeToRead}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {guide.content.steps && (
                      <span>{guide.content.steps.length} steps</span>
                    )}
                    {guide.content.shortcuts && (
                      <span>{guide.content.shortcuts.length} shortcuts</span>
                    )}
                    {guide.content.tips && (
                      <span>{guide.content.tips.length} tips</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    View Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}