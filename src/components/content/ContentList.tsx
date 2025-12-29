"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Copy, Calendar } from "lucide-react";
import { ContentStatus } from "../editor/ContentStatus";

type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
type SortField = 'title' | 'status' | 'updatedAt' | 'createdAt' | 'views';
type SortOrder = 'asc' | 'desc';

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
}

interface ContentListProps {
  items: ContentItem[];
  isLoading?: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onView: (item: ContentItem) => void;
  onStatusChange: (item: ContentItem, newStatus: ContentStatus) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
}

export function ContentList({
  items,
  isLoading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  onStatusChange,
  onBulkAction
}: ContentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');

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
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
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

  const getSeoScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBulkActionOptions = () => {
    const selectedCount = selectedItems.length;
    if (selectedCount === 0) return [];
    
    return [
      { id: 'publish', label: 'Publish', disabled: false },
      { id: 'draft', label: 'Set to Draft', disabled: false },
      { id: 'archive', label: 'Archive', disabled: false },
      { id: 'delete', label: 'Delete', disabled: false }
    ];
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content Management</span>
            <Badge variant="outline">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="updatedAt">Updated</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">A-Z</SelectItem>
                <SelectItem value="desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="border-primary">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </span>
              <div className="flex items-center gap-2">
                {getBulkActionOptions().map(action => (
                  <Button
                    key={action.id}
                    variant={action.id === 'delete' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => onBulkAction(action.id, selectedItems)}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium line-clamp-1">{item.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.excerpt}
                      </div>
                      {item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ContentStatus 
                      status={item.status}
                      onStatusChange={(newStatus) => onStatusChange(item, newStatus)}
                      showActions
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{item.author.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.author.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(item.updatedAt)}</div>
                      {item.publishedAt && (
                        <div className="text-muted-foreground text-xs">
                          Published: {formatDate(item.publishedAt)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {item.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.seoScore ? (
                      <div className={`text-sm font-medium ${getSeoScoreColor(item.seoScore)}`}>
                        {item.seoScore}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">--</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first piece of content'
                }
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading content...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}