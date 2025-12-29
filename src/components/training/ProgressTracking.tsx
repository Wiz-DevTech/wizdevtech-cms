'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Star,
  Flame,
  Zap,
  Medal,
  Crown,
  Users,
  BarChart3,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react'

interface UserProgress {
  userId: string
  userName: string
  totalModulesCompleted: number
  totalModulesAvailable: number
  totalTimeSpent: number
  streakDays: number
  lastActiveDate: string
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  points: number
  badges: Badge[]
  certificates: Certificate[]
  weeklyProgress: WeeklyProgress[]
  achievements: Achievement[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earnedDate: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface Certificate {
  id: string
  title: string
  description: string
  issuedDate: string
  expiryDate?: string
  credentialId: string
  verificationUrl: string
}

interface WeeklyProgress {
  week: string
  modulesCompleted: number
  timeSpent: number
  pointsEarned: number
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  total: number
  points: number
  completed: boolean
  icon: React.ReactNode
}

const mockUserProgress: UserProgress = {
  userId: 'user-123',
  userName: 'John Doe',
  totalModulesCompleted: 12,
  totalModulesAvailable: 24,
  totalTimeSpent: 480, // minutes
  streakDays: 7,
  lastActiveDate: '2024-01-15',
  skillLevel: 'Intermediate',
  points: 2450,
  badges: [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first module',
      icon: <Trophy className="h-6 w-6" />,
      earnedDate: '2024-01-10',
      rarity: 'common'
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="h-6 w-6" />,
      earnedDate: '2024-01-15',
      rarity: 'rare'
    },
    {
      id: 'quick-learner',
      name: 'Quick Learner',
      description: 'Complete 5 modules in one week',
      icon: <Zap className="h-6 w-6" />,
      earnedDate: '2024-01-12',
      rarity: 'rare'
    }
  ],
  certificates: [
    {
      id: 'basic-cert',
      title: '5CMS Basic Certification',
      description: 'Completed all beginner modules and passed the assessment',
      issuedDate: '2024-01-08',
      credentialId: '5CMS-BASIC-2024-001',
      verificationUrl: 'https://verify.5cms.com/5CMS-BASIC-2024-001'
    }
  ],
  weeklyProgress: [
    { week: 'Week 1', modulesCompleted: 3, timeSpent: 120, pointsEarned: 300 },
    { week: 'Week 2', modulesCompleted: 5, timeSpent: 180, pointsEarned: 550 },
    { week: 'Week 3', modulesCompleted: 4, timeSpent: 180, pointsEarned: 400 }
  ],
  achievements: [
    {
      id: 'module-master',
      title: 'Module Master',
      description: 'Complete 20 modules',
      progress: 12,
      total: 20,
      points: 500,
      completed: false,
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      id: 'time-investor',
      title: 'Time Investor',
      description: 'Spend 10 hours learning',
      progress: 480,
      total: 600,
      points: 300,
      completed: false,
      icon: <Clock className="h-6 w-6" />
    },
    {
      id: 'point-collector',
      title: 'Point Collector',
      description: 'Earn 3000 points',
      progress: 2450,
      total: 3000,
      points: 200,
      completed: false,
      icon: <Star className="h-6 w-6" />
    }
  ]
}

export default function ProgressTracking() {
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress)
  const [selectedTab, setSelectedTab] = useState('overview')

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.round((progress / total) * 100)
  }

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-blue-100 text-blue-800'
      case 'Advanced': return 'bg-purple-100 text-purple-800'
      case 'Expert': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 border-gray-300'
      case 'rare': return 'bg-blue-100 border-blue-300'
      case 'epic': return 'bg-purple-100 border-purple-300'
      case 'legendary': return 'bg-yellow-100 border-yellow-300'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Learning Progress</h1>
          <p className="mt-2 text-gray-600">Track your journey and celebrate your achievements</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {getProgressPercentage(userProgress.totalModulesCompleted, userProgress.totalModulesAvailable)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {userProgress.totalModulesCompleted} of {userProgress.totalModulesAvailable} modules
                  </p>
                  <Progress 
                    value={getProgressPercentage(userProgress.totalModulesCompleted, userProgress.totalModulesAvailable)} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Learning Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{userProgress.streakDays}</div>
                      <p className="text-sm text-gray-600">days in a row</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="text-3xl font-bold text-yellow-600">{userProgress.points.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">points earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Skill Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Award className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{userProgress.skillLevel}</div>
                      <p className="text-sm text-gray-600">current level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userProgress.badges.slice(0, 3).map(badge => (
                    <div key={badge.id} className={`p-4 border rounded-lg ${getBadgeRarityColor(badge.rarity)}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{badge.name}</h4>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Earned {badge.earnedDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProgress.achievements.filter(a => !a.completed).map(achievement => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {achievement.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">+{achievement.points} pts</p>
                        <p className="text-xs text-gray-500">
                          {achievement.progress}/{achievement.total}
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={getProgressPercentage(achievement.progress, achievement.total)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Medal className="h-5 w-5 mr-2" />
                  All Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProgress.badges.map(badge => (
                    <div key={badge.id} className={`p-4 border-2 rounded-lg ${getBadgeRarityColor(badge.rarity)}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-white rounded-lg">
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{badge.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <p className="text-xs text-gray-500">Earned on {badge.earnedDate}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Your Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProgress.certificates.map(certificate => (
                    <div key={certificate.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Award className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{certificate.title}</h3>
                            <p className="text-gray-600 mt-1">{certificate.description}</p>
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <span>Issued: {certificate.issuedDate}</span>
                              {certificate.expiryDate && <span>Expires: {certificate.expiryDate}</span>}
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">ID: {certificate.credentialId}</Badge>
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProgress.weeklyProgress.map((week, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{week.week}</span>
                          <span className="text-gray-600">
                            {week.modulesCompleted} modules • {formatTime(week.timeSpent)} • {week.pointsEarned} pts
                          </span>
                        </div>
                        <Progress value={(week.modulesCompleted / 6) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Learning Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Content Creation</span>
                        <span className="text-gray-600">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Tools</span>
                        <span className="text-gray-600">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>SEO & Analytics</span>
                        <span className="text-gray-600">20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Collaboration</span>
                        <span className="text-gray-600">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Team Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: 'Alice Johnson', points: 3200, level: 'Expert' },
                    { rank: 2, name: 'Bob Smith', points: 2850, level: 'Advanced' },
                    { rank: 3, name: 'You', points: userProgress.points, level: userProgress.skillLevel, isUser: true },
                    { rank: 4, name: 'Carol White', points: 2100, level: 'Advanced' },
                    { rank: 5, name: 'David Brown', points: 1950, level: 'Intermediate' }
                  ].map(user => (
                    <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{user.points.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}