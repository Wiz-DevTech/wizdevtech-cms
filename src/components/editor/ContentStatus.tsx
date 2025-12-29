"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Clock, 
  Calendar, 
  CheckCircle, 
  Archive,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";

type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface ContentStatusProps {
  status: ContentStatus;
  onStatusChange?: (newStatus: ContentStatus) => void;
  showActions?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

export function ContentStatus({ 
  status, 
  onStatusChange, 
  showActions = false,
  size = 'default'
}: ContentStatusProps) {
  const getStatusConfig = (status: ContentStatus) => {
    const configs = {
      draft: {
        label: 'Draft',
        icon: <Edit className="h-3 w-3" />,
        variant: 'secondary' as const,
        color: 'var(--status-draft)',
        description: 'Work in progress'
      },
      scheduled: {
        label: 'Scheduled',
        icon: <Calendar className="h-3 w-3" />,
        variant: 'default' as const,
        color: 'var(--status-scheduled)',
        description: 'Scheduled to publish'
      },
      published: {
        label: 'Published',
        icon: <CheckCircle className="h-3 w-3" />,
        variant: 'default' as const,
        color: 'var(--status-published)',
        description: 'Live and visible'
      },
      archived: {
        label: 'Archived',
        icon: <Archive className="h-3 w-3" />,
        variant: 'outline' as const,
        color: 'var(--status-archived)',
        description: 'No longer active'
      }
    };
    return configs[status];
  };

  const config = getStatusConfig(status);

  const getNextStatuses = (): ContentStatus[] => {
    switch (status) {
      case 'draft':
        return ['scheduled', 'published'];
      case 'scheduled':
        return ['draft', 'published'];
      case 'published':
        return ['archived'];
      case 'archived':
        return ['draft'];
      default:
        return [];
    }
  };

  const handleStatusChange = (newStatus: ContentStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1.5';
      default:
        return 'text-sm px-2.5 py-1';
    }
  };

  if (showActions && onStatusChange) {
    const nextStatuses = getNextStatuses();
    
    if (nextStatuses.length === 0) {
      // Just show the status badge
      return (
        <Badge 
          variant={config.variant}
          className={getSizeClasses()}
          style={{ 
            backgroundColor: status === 'published' ? config.color : undefined,
            borderColor: config.color,
            color: status === 'published' ? 'white' : config.color
          }}
        >
          <div className="flex items-center gap-1">
            {config.icon}
            {config.label}
          </div>
        </Badge>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
          >
            <Badge 
              variant={config.variant}
              className={getSizeClasses()}
              style={{ 
                backgroundColor: status === 'published' ? config.color : undefined,
                borderColor: config.color,
                color: status === 'published' ? 'white' : config.color
              }}
            >
              <div className="flex items-center gap-1">
                {config.icon}
                {config.label}
              </div>
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="px-2 py-1.5 text-sm font-medium">
            Change status to:
          </div>
          <DropdownMenuSeparator />
          {nextStatuses.map((nextStatus) => {
            const nextConfig = getStatusConfig(nextStatus);
            return (
              <DropdownMenuItem
                key={nextStatus}
                onClick={() => handleStatusChange(nextStatus)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: nextConfig.color }}
                  />
                  {nextConfig.icon}
                  <span>{nextConfig.label}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Simple badge display
  return (
    <Badge 
      variant={config.variant}
      className={getSizeClasses()}
      style={{ 
        backgroundColor: status === 'published' ? config.color : undefined,
        borderColor: config.color,
        color: status === 'published' ? 'white' : config.color
      }}
    >
      <div className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </div>
    </Badge>
  );
}

// Status Timeline Component
interface StatusTimelineProps {
  statusHistory: Array<{
    status: ContentStatus;
    timestamp: Date;
    changedBy: string;
    note?: string;
  }>;
}

export function StatusTimeline({ statusHistory }: StatusTimelineProps) {
  const getStatusConfig = (status: ContentStatus) => {
    const configs = {
      draft: {
        label: 'Draft',
        icon: <Edit className="h-3 w-3" />,
        color: 'var(--status-draft)'
      },
      scheduled: {
        label: 'Scheduled',
        icon: <Calendar className="h-3 w-3" />,
        color: 'var(--status-scheduled)'
      },
      published: {
        label: 'Published',
        icon: <CheckCircle className="h-3 w-3" />,
        color: 'var(--status-published)'
      },
      archived: {
        label: 'Archived',
        icon: <Archive className="h-3 w-3" />,
        color: 'var(--status-archived)'
      }
    };
    return configs[status];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {statusHistory.map((entry, index) => {
        const config = getStatusConfig(entry.status);
        const isLast = index === statusHistory.length - 1;
        
        return (
          <div key={index} className="flex items-start gap-3">
            <div className="relative">
              <div 
                className="flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white"
                style={{ borderColor: config.color }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
              </div>
              {!isLast && (
                <div 
                  className="absolute top-6 left-3 w-0.5 h-8"
                  style={{ backgroundColor: config.color }}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  {config.icon}
                  <span className="font-medium text-sm">{config.label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatDate(entry.timestamp)}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                by {entry.changedBy}
              </p>
              
              {entry.note && (
                <p className="text-sm text-muted-foreground mt-1 italic">
                  "{entry.note}"
                </p>
              )}
            </div>
          </div>
        );
      })}
      
      {statusHistory.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No status history available.</p>
        </div>
      )}
    </div>
  );
}