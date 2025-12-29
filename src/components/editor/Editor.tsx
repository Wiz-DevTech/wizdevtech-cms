"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save,
  Eye,
  Clock,
  Calendar,
  User,
  FileText,
  Settings,
  History,
  RotateCcw,
  Download,
  Upload,
  Tag
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ContentStatus, StatusTimeline } from "./ContentStatus";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { DocumentRecovery } from "./DocumentRecovery";
import { VersionHistory } from "./VersionHistory";

interface EditorDocument {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  author: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
  wordCount: number;
  readingTime: number;
  seoScore?: number;
}

interface EditorProps {
  document?: EditorDocument;
  onSave: (document: EditorDocument) => void;
  onPreview: (document: EditorDocument) => void;
  isLoading?: boolean;
}

export function Editor({ 
  document: initialDocument,
  onSave,
  onPreview,
  isLoading = false
}: EditorProps) {
  const [document, setDocument] = useState<EditorDocument>(
    initialDocument || {
      id: '',
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      author: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      wordCount: 0,
      readingTime: 0
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Mock recovered documents
  const [recoveredDocuments] = useState([
    {
      id: 'recovered-1',
      title: 'Unsaved Article',
      lastModified: new Date(Date.now() - 1000 * 60 * 30),
      content: 'This is the content of an unsaved document...',
      wordCount: 150,
      autoSaveVersion: true
    }
  ]);

  // Mock version history
  const [versionHistory] = useState([
    {
      id: 'v1',
      version: '1.0',
      title: 'Initial Draft',
      description: 'First version of the article',
      author: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      wordCount: 800,
      changesCount: 0,
      isCurrentVersion: false,
      isMajorVersion: true
    },
    {
      id: 'v2',
      version: '1.1',
      title: 'Added SEO Section',
      description: 'Added comprehensive SEO optimization section',
      author: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      wordCount: 1200,
      changesCount: 15,
      isCurrentVersion: false,
      isMajorVersion: false
    },
    {
      id: 'v3',
      version: '2.0',
      title: 'Complete Rewrite',
      description: 'Major rewrite with improved structure',
      author: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      createdAt: new Date(),
      wordCount: 1500,
      changesCount: 45,
      isCurrentVersion: true,
      isMajorVersion: true
    }
  ]);

  // Auto-save logic
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (hasUnsavedChanges && !isSaving) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [hasUnsavedChanges, isSaving]);

  const handleAutoSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleContentChange = useCallback((content: any) => {
    setDocument(prev => ({
      ...prev,
      content: content.html,
      wordCount: content.wordCount,
      readingTime: Math.ceil(content.wordCount / 200) // 200 words per minute
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(document);
      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [document, onSave]);

  const handleStatusChange = useCallback((newStatus: EditorDocument['status']) => {
    setDocument(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date(),
      publishedAt: newStatus === 'published' ? new Date() : prev.publishedAt
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleForceSave = useCallback(() => {
    handleSave();
  }, [handleSave]);

  const calculateReadingTime = (wordCount: number) => {
    return Math.ceil(wordCount / 200);
  };

  const getSeoScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeoScoreLabel = (score?: number) => {
    if (!score) return 'Not analyzed';
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Auto-save Indicator */}
      <AutoSaveIndicator
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedAt={lastSavedAt}
        onForceSave={handleForceSave}
      />

      {/* Document Recovery Dialog */}
      <DocumentRecovery
        isOpen={showRecovery}
        onClose={() => setShowRecovery(false)}
        onRecover={(doc) => {
          setDocument(prev => ({
            ...prev,
            title: doc.title,
            content: doc.content,
            wordCount: doc.wordCount
          }));
          setShowRecovery(false);
        }}
        onDelete={(id) => {
          console.log('Delete recovered document:', id);
        }}
        recoveredDocuments={recoveredDocuments}
      />

      {/* Version History Dialog */}
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestoreVersion={(versionId) => {
          console.log('Restore version:', versionId);
          setShowVersionHistory(false);
        }}
        onCompareVersions={(v1, v2) => {
          console.log('Compare versions:', v1, v2);
        }}
        versions={versionHistory}
        currentVersionId="v3"
      />

      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecovery(true)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Recovery
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(document)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b bg-muted/30">
              <div className="flex items-center justify-between p-4">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4">
                  <ContentStatus
                    status={document.status}
                    onStatusChange={handleStatusChange}
                    showActions
                  />
                  <Badge variant="outline" className="text-xs">
                    {document.wordCount} words • {calculateReadingTime(document.wordCount)} min read
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full m-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b">
                    <Input
                      placeholder="Enter your title..."
                      value={document.title}
                      onChange={(e) => {
                        setDocument(prev => ({ ...prev, title: e.target.value }));
                        setHasUnsavedChanges(true);
                      }}
                      className="text-2xl font-bold border-none p-0 focus-visible:ring-0 shadow-none"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <RichTextEditor
                      content={document.content}
                      onChange={handleContentChange}
                      placeholder="Start writing your content..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Document Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="excerpt">Excerpt</Label>
                          <Textarea
                            id="excerpt"
                            placeholder="Brief description of your content..."
                            value={document.excerpt}
                            onChange={(e) => {
                              setDocument(prev => ({ ...prev, excerpt: e.target.value }));
                              setHasUnsavedChanges(true);
                            }}
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="tags">Tags</Label>
                          <Input
                            id="tags"
                            placeholder="Enter tags separated by commas..."
                            value={document.tags.join(', ')}
                            onChange={(e) => {
                              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                              setDocument(prev => ({ ...prev, tags }));
                              setHasUnsavedChanges(true);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Created</Label>
                            <p className="text-sm text-muted-foreground">
                              {document.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Label>Last Modified</Label>
                            <p className="text-sm text-muted-foreground">
                              {document.updatedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label>Author</Label>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            {document.author.name} ({document.author.email})
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="seo" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          SEO Analysis
                        </CardTitle>
                        <CardDescription>
                          Optimize your content for search engines
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-8">
                          <div className={`text-4xl font-bold mb-2 ${getSeoScoreColor(document.seoScore)}`}>
                            {document.seoScore || '--'}
                          </div>
                          <div className="text-lg text-muted-foreground">
                            {getSeoScoreLabel(document.seoScore)}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Title Length</span>
                            <Badge variant={document.title.length > 60 ? 'destructive' : 'secondary'}>
                              {document.title.length}/60
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Meta Description</span>
                            <Badge variant={document.excerpt.length > 160 ? 'destructive' : 'secondary'}>
                              {document.excerpt.length}/160
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Word Count</span>
                            <Badge variant={document.wordCount < 300 ? 'destructive' : 'secondary'}>
                              {document.wordCount}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/30">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Document Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Words</span>
                <span className="font-medium">{document.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Time</span>
                <span className="font-medium">{calculateReadingTime(document.wordCount)} min</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <ContentStatus status={document.status} size="sm" />
              </div>
              <div className="flex justify-between">
                <span>Last Saved</span>
                <span className="font-medium">
                  {lastSavedAt ? lastSavedAt.toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}