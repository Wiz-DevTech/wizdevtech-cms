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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  History, 
  User, 
  Calendar, 
  FileText, 
  GitBranch, 
  ArrowLeft, 
  ArrowRight,
  Compare
} from "lucide-react";

interface Version {
  id: string;
  version: string;
  title: string;
  description: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: Date;
  wordCount: number;
  changesCount: number;
  isCurrentVersion: boolean;
  isMajorVersion: boolean;
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (versionId: string) => void;
  onCompareVersions: (versionId1: string, versionId2: string) => void;
  versions: Version[];
  currentVersionId: string;
}

export function VersionHistory({
  isOpen,
  onClose,
  onRestoreVersion,
  onCompareVersions,
  versions,
  currentVersionId,
}: VersionHistoryProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getVersionTypeBadge = (version: Version) => {
    if (version.isCurrentVersion) {
      return <Badge className="bg-green-100 text-green-800">Current</Badge>;
    }
    if (version.isMajorVersion) {
      return <Badge variant="secondary">Major</Badge>;
    }
    return <Badge variant="outline">Patch</Badge>;
  };

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      setSelectedVersions(prev => {
        if (prev.includes(versionId)) {
          return prev.filter(id => id !== versionId);
        } else if (prev.length < 2) {
          return [...prev, versionId];
        }
        return prev;
      });
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
      setCompareMode(false);
      setSelectedVersions([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              <DialogTitle>Version History</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              {compareMode && (
                <div className="flex items-center gap-2 text-sm">
                  <span>Selected: {selectedVersions.length}/2</span>
                  {selectedVersions.length === 2 && (
                    <Button size="sm" onClick={handleCompare}>
                      <Compare className="h-3 w-3 mr-1" />
                      Compare
                    </Button>
                  )}
                </div>
              )}
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedVersions([]);
                }}
              >
                {compareMode ? "Cancel Compare" : "Compare Versions"}
              </Button>
            </div>
          </div>
          <DialogDescription>
            View and restore previous versions of this document.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {versions.map((version, index) => (
              <Card 
                key={version.id}
                className={`transition-all cursor-pointer hover:shadow-md ${
                  selectedVersions.includes(version.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : ''
                } ${version.isCurrentVersion ? 'border-green-200 bg-green-50/50' : ''}`}
                onClick={() => handleVersionSelect(version.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">
                          {getInitials(version.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">
                            Version {version.version}
                          </CardTitle>
                          {getVersionTypeBadge(version)}
                        </div>
                        <CardDescription className="text-sm">
                          {version.title}
                        </CardDescription>
                        {version.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {version.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(version.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {version.wordCount} words
                          </div>
                          {version.changesCount > 0 && (
                            <div className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              {version.changesCount} changes
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {index < versions.length - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestoreVersion(version.id);
                            onClose();
                          }}
                          disabled={version.isCurrentVersion}
                        >
                          Restore
                        </Button>
                      )}
                      {compareMode && (
                        <div className="flex items-center">
                          {selectedVersions.includes(version.id) && (
                            <Badge variant="default">
                              {selectedVersions[0] === version.id ? 'Version 1' : 'Version 2'}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            
            {versions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No version history</h3>
                <p>Version history will appear here once you start saving changes.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}