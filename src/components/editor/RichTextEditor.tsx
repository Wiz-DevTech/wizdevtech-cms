"use client";

import { useState, useCallback, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Eye,
  Settings,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditorContent {
  html: string;
  text: string;
  wordCount: number;
  characterCount: number;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: EditorContent) => void;
  placeholder?: string;
  readonly?: boolean;
  showToolbar?: boolean;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  readonly = false,
  showToolbar = true,
  className = ""
}: RichTextEditorProps) {
  const [editorHtml, setEditorHtml] = useState(content);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Calculate content metrics
  const calculateMetrics = useCallback((html: string): EditorContent => {
    const text = html.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return {
      html,
      text,
      wordCount: words.length,
      characterCount: text.length
    };
  }, []);

  // Update content and notify parent
  const updateContent = useCallback((newHtml: string) => {
    setEditorHtml(newHtml);
    const metrics = calculateMetrics(newHtml);
    onChange(metrics);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHtml);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [calculateMetrics, onChange, history, historyIndex]);

  // Handle text formatting
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const newHtml = document.getElementById('editor-content')?.innerHTML || '';
    updateContent(newHtml);
  };

  // Handle list insertion
  const insertList = (ordered: boolean) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    document.execCommand(command);
    const newHtml = document.getElementById('editor-content')?.innerHTML || '';
    updateContent(newHtml);
  };

  // Handle link insertion
  const insertLink = () => {
    if (linkUrl) {
      document.execCommand('createLink', false, linkUrl);
      const newHtml = document.getElementById('editor-content')?.innerHTML || '';
      updateContent(newHtml);
      setLinkUrl('');
      setIsLinkDialogOpen(false);
    }
  };

  // Handle image insertion
  const insertImage = () => {
    if (imageUrl) {
      const imgHtml = `<img src="${imageUrl}" alt="${imageAlt || ''}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, imgHtml);
      const newHtml = document.getElementById('editor-content')?.innerHTML || '';
      updateContent(newHtml);
      setImageUrl('');
      setImageAlt('');
      setIsImageDialogOpen(false);
    }
  };

  // Handle undo/redo
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditorHtml(history[newIndex]);
      const metrics = calculateMetrics(history[newIndex]);
      onChange(metrics);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditorHtml(history[newIndex]);
      const metrics = calculateMetrics(history[newIndex]);
      onChange(metrics);
    }
  };

  // Handle editor content changes
  const handleEditorChange = () => {
    const newHtml = document.getElementById('editor-content')?.innerHTML || '';
    setEditorHtml(newHtml);
    const metrics = calculateMetrics(newHtml);
    onChange(metrics);
  };

  // Initialize editor content
  useEffect(() => {
    const editor = document.getElementById('editor-content');
    if (editor && editor.innerHTML !== content) {
      editor.innerHTML = content;
    }
  }, [content]);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {showToolbar && !readonly && (
        <div className="border-b bg-muted/50 p-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={historyIndex === 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <Toggle
                size="sm"
                onPressedChange={() => formatText('bold')}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('italic')}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('underline')}
              >
                <Underline className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('strikeThrough')}
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Headings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Heading1 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => formatText('formatBlock', 'h1')}>
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => formatText('formatBlock', 'h2')}>
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => formatText('formatBlock', 'h3')}>
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => formatText('formatBlock', 'p')}>
                  <span className="w-4 h-4 mr-2 text-sm">P</span>
                  Paragraph
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <Toggle
                size="sm"
                onPressedChange={() => formatText('justifyLeft')}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('justifyCenter')}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('justifyRight')}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('justifyFull')}
              >
                <AlignJustify className="h-4 w-4" />
              </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <Toggle
                size="sm"
                onPressedChange={() => insertList(false)}
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => insertList(true)}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Insert Elements */}
            <div className="flex items-center gap-1">
              <Toggle
                size="sm"
                onPressedChange={() => formatText('formatBlock', 'blockquote')}
              >
                <Quote className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                onPressedChange={() => formatText('formatBlock', 'pre')}
              >
                <Code className="h-4 w-4" />
              </Toggle>
              
              <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Link className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Link</DialogTitle>
                    <DialogDescription>
                      Add a hyperlink to your content
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    <Button onClick={insertLink}>Insert Link</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                    <DialogDescription>
                      Add an image to your content
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageAlt">Alt Text</Label>
                      <Input
                        id="imageAlt"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Describe the image"
                      />
                    </div>
                    <Button onClick={insertImage}>Insert Image</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Options */}
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div
        id="editor-content"
        contentEditable={!readonly}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        onInput={handleEditorChange}
        dangerouslySetInnerHTML={{ __html: editorHtml }}
        style={{
          minHeight: readonly ? 'auto' : '400px'
        }}
      />

      {readonly && editorHtml === '' && (
        <div className="p-4 text-center text-muted-foreground">
          No content to display
        </div>
      )}
    </div>
  );
}