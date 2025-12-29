"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, FileText, Trash2, Eye } from "lucide-react";

interface RecoveredDocument {
  id: string;
  title: string;
  lastModified: Date;
  content: string;
  wordCount: number;
  autoSaveVersion: boolean;
}

interface DocumentRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (document: RecoveredDocument) => void;
  onDelete: (documentId: string) => void;
  recoveredDocuments: RecoveredDocument[];
}

export function DocumentRecovery({
  isOpen,
  onClose,
  onRecover,
  onDelete,
  recoveredDocuments,
}: DocumentRecoveryProps) {
  const [selectedDocument, setSelectedDocument] = useState<RecoveredDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const formatLastModified = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      }
    }
  };

  const handlePreview = (document: RecoveredDocument) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  const handleRecover = () => {
    if (selectedDocument) {
      onRecover(selectedDocument);
      setShowPreview(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Recovery
            </DialogTitle>
            <DialogDescription>
              Recover recently edited documents that were not saved properly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Documents List */}
            <div>
              <h3 className="font-semibold mb-4">Recovered Documents</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {recoveredDocuments.map((doc) => (
                    <Card 
                      key={doc.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDocument?.id === doc.id 
                          ? 'ring-2 ring-primary' 
                          : ''
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium truncate">
                            {doc.title}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            {doc.autoSaveVersion && (
                              <Badge variant="secondary" className="text-xs">
                                Auto-saved
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(doc.id);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {formatLastModified(doc.lastModified)}
                          <span className="ml-2">•</span>
                          <span className="ml-2">{doc.wordCount} words</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(doc);
                            }}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRecover(doc);
                              onClose();
                            }}
                            className="flex-1"
                          >
                            Recover
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {recoveredDocuments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recovered documents found.</p>
                      <p className="text-sm">Documents appear here when they're not saved properly.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Preview Panel */}
            <div>
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="h-[400px] border rounded-lg p-4 bg-muted/50">
                {selectedDocument ? (
                  <div className="h-full flex flex-col">
                    <div className="mb-4 pb-4 border-b">
                      <h4 className="font-medium">{selectedDocument.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatLastModified(selectedDocument.lastModified)} • {selectedDocument.wordCount} words
                      </p>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="prose prose-sm max-w-none">
                        {selectedDocument.content.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-2">
                            {paragraph || <span>&nbsp;</span>}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="mt-4 pt-4 border-t">
                      <Button onClick={handleRecover} className="w-full">
                        Recover This Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Select a document to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}