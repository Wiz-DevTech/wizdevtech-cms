"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  MoreHorizontal, 
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  BarChart3
} from "lucide-react";
import { ContentStatus } from "../editor/ContentStatus";

type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  status: ContentStatus;
  author: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views: number;
  wordCount: number;
  tags: string[];
  seoScore?: number;
  featuredImage?: string;
}

interface ContentGridProps {
  items: ContentItem[];
  isLoading?: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onView: (item: ContentItem) => void;
  onStatusChange: (item: ContentItem, newStatus: ContentStatus) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
}

export function ContentGrid({
  items,
  isLoading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onStatusChange,
  onBulkAction
}: ContentGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default: // updatedAt
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (wordCount: number) => {
    return Math.ceil(wordCount / 200);
  };

  const getSeoScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: ContentStatus) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'draft': return 'text-orange-600';
      case 'archived': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Library</h2>
          <p className="text-muted-foreground">
            Manage and organize all your content in one place
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Recently Updated</SelectItem>
              <SelectItem value="createdAt">Recently Created</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onBulkAction('publish', selectedItems)}>
                Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => onBulkAction('draft', selectedItems)}>
                Set to Draft
              </Button>
              <Button size="sm" variant="outline" onClick={() => onBulkAction('archive', selectedItems)}>
                Archive
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onBulkAction('delete', selectedItems)}>
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedItems([])}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className={`hover:shadow-lg transition-all cursor-pointer ${
              selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  />
                  <ContentStatus 
                    status={item.status}
                    onStatusChange={(newStatus) => onStatusChange(item, newStatus)}
                    showActions
                    size="sm"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(item)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(item)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(item)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <CardTitle className="text-lg line-clamp-2 leading-tight">
                {item.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-sm">
                {item.excerpt}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-3">
              {/* Featured Image */}
              {item.featuredImage && (
                <div className="mb-4 rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={item.featuredImage} 
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
              
              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{item.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{formatDate(item.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span>{item.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{getReadingTime(item.wordCount)} min read</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  {item.seoScore && (
                    <div className={`text-sm font-medium ${getSeoScoreColor(item.seoScore)}`}>
                      SEO: {item.seoScore}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {item.wordCount} words
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onView(item)}>
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No content found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
              : 'Your content library is empty. Start creating amazing content!'
            }
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your content...</p>
        </div>
      )}
    </div>
  );
}