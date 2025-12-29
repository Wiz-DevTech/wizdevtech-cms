"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  RefreshCw,
  Brain,
  Zap,
  Target,
  TrendingUp,
  FileText,
  Hash,
  MessageSquare
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AISuggestion {
  id: string;
  type: 'seo' | 'readability' | 'tone' | 'structure' | 'keywords' | 'content';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
  original?: string;
  category: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt?: Date;
}

interface AIAssistantProps {
  content: string;
  title: string;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onRejectSuggestion: (suggestionId: string) => void;
  isLoading?: boolean;
}

export function AIAssistant({
  content,
  title,
  onApplySuggestion,
  onRejectSuggestion,
  isLoading = false
}: AIAssistantProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');

  // Mock AI analysis - in real app, this would call AI service
  const analyzeContent = async () => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'seo',
        title: 'Add Target Keywords',
        description: 'Include "content management system" in your headings',
        impact: 'high',
        confidence: 92,
        suggestion: 'Consider adding "content management system" to H2 or H3 headings to improve SEO ranking',
        category: 'SEO Optimization',
        status: 'pending'
      },
      {
        id: '2',
        type: 'readability',
        title: 'Improve Sentence Structure',
        description: 'Some sentences are too long for optimal readability',
        impact: 'medium',
        confidence: 85,
        suggestion: 'Break down long sentences (20+ words) into shorter ones for better readability',
        category: 'Readability',
        status: 'pending'
      },
      {
        id: '3',
        type: 'tone',
        title: 'Adjust Tone for Target Audience',
        description: 'Content tone could be more engaging for beginners',
        impact: 'medium',
        confidence: 78,
        suggestion: 'Use more conversational language and add real-world examples',
        category: 'Tone & Style',
        status: 'pending'
      },
      {
        id: '4',
        type: 'structure',
        title: 'Add More Subheadings',
        description: 'Content could benefit from better structure',
        impact: 'low',
        confidence: 70,
        suggestion: 'Add 2-3 subheadings to break up content and improve scannability',
        category: 'Structure',
        status: 'pending'
      },
      {
        id: '5',
        type: 'keywords',
        title: 'Related Keywords Opportunity',
        description: 'Include related keywords to improve semantic SEO',
        impact: 'high',
        confidence: 88,
        suggestion: 'Add terms like "CMS platform", "content organization", "digital asset management"',
        category: 'SEO Keywords',
        status: 'pending'
      }
    ];
    
    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (content || title) {
      analyzeContent();
    }
  }, [content, title]);

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion);
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id 
          ? { ...s, status: 'accepted', appliedAt: new Date() }
          : s
      )
    );
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    onRejectSuggestion(suggestionId);
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, status: 'rejected' }
          : s
      )
    );
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      seo: <Target className="h-4 w-4" />,
      readability: <FileText className="h-4 w-4" />,
      tone: <MessageSquare className="h-4 w-4" />,
      structure: <Lightbulb className="h-4 w-4" />,
      keywords: <Hash className="h-4 w-4" />,
      content: <Sparkles className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Lightbulb className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const acceptedSuggestions = suggestions.filter(s => s.status === 'accepted');
  const rejectedSuggestions = suggestions.filter(s => s.status === 'rejected');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Content Assistant
          </CardTitle>
          <CardDescription>
            Get intelligent suggestions to improve your content quality and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{suggestions.length}</div>
                <div className="text-sm text-muted-foreground">Total Suggestions</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(
                  suggestions.length > 0 ? Math.max(...suggestions.map(s => s.confidence)) : 0
                )}`}>
                  {suggestions.length > 0 ? Math.max(...suggestions.map(s => s.confidence)) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {acceptedSuggestions.length}
                </div>
                <div className="text-sm text-muted-foreground">Applied</div>
              </div>
            </div>
            
            <Button 
              onClick={analyzeContent}
              disabled={isAnalyzing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('suggestions')}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Suggestions ({pendingSuggestions.length})
              </Button>
              <Button
                variant={activeTab === 'applied' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('applied')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied ({acceptedSuggestions.length})
              </Button>
              <Button
                variant={activeTab === 'rejected' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('rejected')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejected ({rejectedSuggestions.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-4">
              {activeTab === 'suggestions' && (
                <>
                  {pendingSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {isAnalyzing ? (
                        <>
                          <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                          <p>AI is analyzing your content...</p>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No suggestions available.</p>
                          <p className="text-sm">Try adding more content or re-analyze.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    pendingSuggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(suggestion.type)}
                              <div>
                                <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                <CardDescription className="text-sm">
                                  {suggestion.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getImpactColor(suggestion.impact)}>
                                {suggestion.impact} impact
                              </Badge>
                              <Badge variant="outline">
                                {suggestion.confidence}% confidence
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <div className="text-sm font-medium mb-1">Suggestion:</div>
                              <p className="text-sm">{suggestion.suggestion}</p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApplySuggestion(suggestion)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Apply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectSuggestion(suggestion.id)}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}

              {activeTab === 'applied' && (
                <>
                  {acceptedSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No applied suggestions yet.</p>
                      <p className="text-sm">Apply suggestions to see them here.</p>
                    </div>
                  ) : (
                    acceptedSuggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border-l-4 border-l-green-500 opacity-75">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(suggestion.type)}
                              <div>
                                <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                <CardDescription className="text-sm">
                                  {suggestion.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">
                                Applied
                              </Badge>
                              {getStatusIcon(suggestion.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-muted-foreground">
                            Applied {suggestion.appliedAt?.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}

              {activeTab === 'rejected' && (
                <>
                  {rejectedSuggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No rejected suggestions.</p>
                    </div>
                  ) : (
                    rejectedSuggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border-l-4 border-l-red-500 opacity-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(suggestion.type)}
                              <div>
                                <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                <CardDescription className="text-sm">
                                  {suggestion.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-red-600">
                                Rejected
                              </Badge>
                              {getStatusIcon(suggestion.status)}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}