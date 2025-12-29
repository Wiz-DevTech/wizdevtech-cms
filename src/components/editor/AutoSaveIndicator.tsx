"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  onForceSave: () => void;
}

export function AutoSaveIndicator({
  isSaving,
  hasUnsavedChanges,
  lastSavedAt,
  onForceSave,
}: AutoSaveIndicatorProps) {
  const [visible, setVisible] = useState(true);
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Hide after 10 seconds of inactivity
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      
      setIdleTimer(timer);
    };

    // Reset timer on any prop change
    resetIdleTimer();
    
    return () => {
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [isSaving, hasUnsavedChanges, lastSavedAt]);

  const getStatusIcon = () => {
    if (isSaving) {
      return <Save className="h-4 w-4 animate-spin" />;
    }
    
    if (hasUnsavedChanges) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    
    return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isSaving) {
      return "Saving...";
    }
    
    if (hasUnsavedChanges) {
      return "Unsaved changes";
    }
    
    if (lastSavedAt) {
      const timeAgo = new Date().getTime() - lastSavedAt.getTime();
      const minutes = Math.floor(timeAgo / 60000);
      
      if (minutes < 1) {
        return "Saved just now";
      } else if (minutes < 60) {
        return `Saved ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        return `Saved ${hours} hour${hours !== 1 ? 's' : ''} ago`;
      }
    }
    
    return "Not saved";
  };

  const getStatusColor = () => {
    if (isSaving) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    }
    
    if (hasUnsavedChanges) {
      return "text-orange-600 bg-orange-50 border-orange-200";
    }
    
    return "text-green-600 bg-green-50 border-green-200";
  };

  if (!visible && !isSaving && !hasUnsavedChanges) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all duration-300",
        getStatusColor(),
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {hasUnsavedChanges && !isSaving && (
        <button
          onClick={onForceSave}
          className="ml-2 px-2 py-1 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
        >
          Save Now
        </button>
      )}
    </div>
  );
}