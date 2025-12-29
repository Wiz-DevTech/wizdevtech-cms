'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Play, 
  RotateCcw,
  Eye,
  MousePointer,
  Type,
  Image,
  Settings,
  Save,
  Upload,
  MessageSquare,
  BarChart3,
  Users,
  Lightbulb
} from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  type: 'instruction' | 'interactive' | 'quiz' | 'demo'
  content: {
    text?: string
    image?: string
    interactive?: {
      element: string
      action: string
      expected: string
    }
    quiz?: {
      question: string
      options: string[]
      correct: number
      explanation: string
    }
  }
  tips?: string[]
}

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  steps: TutorialStep[]
  icon: React.ReactNode
}

const tutorials: Tutorial[] = [
  {
    id: 'getting-started-tour',
    title: 'Interactive Dashboard Tour',
    description: 'Learn your way around the 5CMS dashboard with hands-on guidance',
    duration: '10 min',
    difficulty: 'Beginner',
    category: 'Foundation',
    icon: <Eye className="h-6 w-6" />,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to 5CMS',
        description: 'Let\'s start your journey with the 5CMS dashboard',
        type: 'instruction',
        content: {
          text: 'The 5CMS dashboard is your command center for content management. It provides an overview of your content, analytics, and team activity. In this tutorial, you\'ll learn how to navigate the interface and access key features.'
        },
        tips: [
          'Take your time to explore each section',
          'Don\'t worry about making changes - this is a safe environment',
          'You can always restart this tutorial'
        ]
      },
      {
        id: 'navigation',
        title: 'Navigation Basics',
        description: 'Understanding the sidebar and main navigation',
        type: 'interactive',
        content: {
          text: 'The sidebar on the left is your main navigation tool. Each item takes you to a different section of the CMS.',
          interactive: {
            element: '.sidebar-item',
            action: 'Click on the "Content" menu item',
            expected: 'Content page loads'
          }
        },
        tips: [
          'Hover over menu items to see descriptions',
          'Some menus have sub-items you can expand',
          'Your current location is highlighted'
        ]
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Using the quick action buttons for common tasks',
        type: 'interactive',
        content: {
          text: 'The "+ New Content" button is your fastest way to create content. Let\'s try it!',
          interactive: {
            element: '.new-content-btn',
            action: 'Click the "+ New Content" button',
            expected: 'Content creation dialog opens'
          }
        },
        tips: [
          'Quick actions are always available in the top right',
          'You can also use keyboard shortcuts (Ctrl+N)',
          'The button adapts based on your current page'
        ]
      }
    ]
  }
]

export default function InteractiveTutorial() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({})
  const [showFeedback, setShowFeedback] = useState(false)

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial)
    setCurrentStep(0)
    setCompletedSteps([])
    setQuizAnswers({})
    setShowFeedback(false)
  }

  const nextStep = () => {
    if (!selectedTutorial) return
    
    const stepId = selectedTutorial.steps[currentStep].id
    setCompletedSteps([...completedSteps, stepId])
    
    if (currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowFeedback(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowFeedback(false)
    }
  }

  const restartTutorial = () => {
    if (!selectedTutorial) return
    setCurrentStep(0)
    setCompletedSteps([])
    setQuizAnswers({})
    setShowFeedback(false)
  }

  const handleQuizAnswer = (stepId: string, answerIndex: number) => {
    setQuizAnswers({...quizAnswers, [stepId]: answerIndex})
    setShowFeedback(true)
  }

  const getProgress = () => {
    if (!selectedTutorial) return 0
    return ((completedSteps.length + (showFeedback ? 1 : 0)) / selectedTutorial.steps.length) * 100
  }

  if (selectedTutorial) {
    const step = selectedTutorial.steps[currentStep]
    
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Tutorial Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {selectedTutorial.icon}
                  </div>
                  <div>
                    <CardTitle>{selectedTutorial.title}</CardTitle>
                    <p className="text-gray-600">{selectedTutorial.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={restartTutorial}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Step {currentStep + 1} of {selectedTutorial.steps.length}</span>
                  <span>{Math.round(getProgress())}% Complete</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Badge variant={step.type === 'quiz' ? 'destructive' : 
                               step.type === 'interactive' ? 'default' : 'secondary'}>
                  {step.type.charAt(0).toUpperCase() + step.type.slice(1)}
                </Badge>
                <CardTitle>{step.title}</CardTitle>
              </div>
              <p className="text-gray-600">{step.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Content */}
              {step.content.text && (
                <div className="prose max-w-none">
                  <p>{step.content.text}</p>
                </div>
              )}

              {/* Interactive Content */}
              {step.type === 'interactive' && step.content.interactive && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MousePointer className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Interactive Step</span>
                  </div>
                  <p className="text-blue-800 mb-2">{step.content.interactive.action}</p>
                  <div className="bg-white border border-blue-300 rounded p-3 text-sm text-blue-700">
                    <strong>Expected:</strong> {step.content.interactive.expected}
                  </div>
                </div>
              )}

              {/* Quiz Content */}
              {step.type === 'quiz' && step.content.quiz && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-900">Knowledge Check</span>
                    </div>
                    <p className="font-medium text-purple-900 mb-4">{step.content.quiz.question}</p>
                    <div className="space-y-2">
                      {step.content.quiz.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={quizAnswers[step.id] === index ? 'default' : 'outline'}
                          className="w-full justify-start text-left"
                          onClick={() => handleQuizAnswer(step.id, index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {showFeedback && (
                    <div className={`p-4 rounded-lg ${
                      quizAnswers[step.id] === step.content.quiz!.correct 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {quizAnswers[step.id] === step.content.quiz!.correct ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                            ✗
                          </div>
                        )}
                        <span className={`font-medium ${
                          quizAnswers[step.id] === step.content.quiz!.correct 
                            ? 'text-green-900' 
                            : 'text-red-900'
                        }`}>
                          {quizAnswers[step.id] === step.content.quiz!.correct ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className={`mt-2 ${
                        quizAnswers[step.id] === step.content.quiz!.correct 
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        {step.content.quiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tips */}
              {step.tips && step.tips.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Pro Tips</span>
                  </div>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {step.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {step.type === 'quiz' ? (
                  <Button
                    onClick={nextStep}
                    disabled={!showFeedback}
                  >
                    {currentStep === selectedTutorial.steps.length - 1 ? 'Complete' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    {currentStep === selectedTutorial.steps.length - 1 ? 'Complete' : 'Next'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interactive Tutorials</h1>
          <p className="mt-2 text-gray-600">Learn by doing with hands-on guided tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {tutorial.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={
                        tutorial.difficulty === 'Beginner' ? 'secondary' : 
                        tutorial.difficulty === 'Intermediate' ? 'default' : 'destructive'
                      }>
                        {tutorial.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{tutorial.steps.length} steps</Badge>
                  <Button onClick={() => startTutorial(tutorial)}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Tutorial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}