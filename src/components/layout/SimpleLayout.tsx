"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home,
  FileText,
  Edit3,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  Brain,
  Calendar,
  Archive,
  Tags,
  MessageSquare,
  HelpCircle,
  LogOut,
  User,
  Zap,
  Eye
} from "lucide-react";

interface NavigationItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
}

interface LayoutProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    permissions?: string[];
  };
  children: React.ReactNode;
}

export function SimpleLayout({ user, children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const togglePreviewMode = () => {
    if (pathname === "/preview") {
      router.push("/");
    } else {
      router.push("/preview");
    }
  };

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      href: "/",
      isActive: pathname === "/"
    },
    {
      title: "All Content",
      icon: <FileText className="h-4 w-4" />,
      href: "/content",
      isActive: pathname === "/content"
    },
    {
      title: "Create New",
      icon: <Edit3 className="h-4 w-4" />,
      href: "/content/create",
      isActive: pathname === "/content/create"
    },
    {
      title: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      href: "/analytics",
      isActive: pathname?.startsWith("/analytics"),
      badge: "New"
    },
    {
      title: "AI Assistant",
      icon: <Brain className="h-4 w-4" />,
      href: "/ai",
      isActive: pathname?.startsWith("/ai"),
      badge: <Zap className="h-3 w-3" />
    },
    {
      title: "Comments",
      icon: <MessageSquare className="h-4 w-4" />,
      href: "/comments",
      isActive: pathname === "/comments",
      badge: 12
    },
    ...(user?.permissions?.includes("users:manage") ? [{
      title: "Users",
      icon: <Users className="h-4 w-4" />,
      href: "/users",
      isActive: pathname?.startsWith("/users")
    }] : []),
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings",
      isActive: pathname?.startsWith("/settings")
    },
    {
      title: pathname === "/preview" ? "Exit Preview" : "Preview Mode",
      icon: <Eye className="h-4 w-4" />,
      onClick: togglePreviewMode,
      badge: pathname === "/preview" ? "Active" : undefined
    }
  ];

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`w-64 border-r bg-background transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">5C</span>
              </div>
              <span className="text-lg font-semibold">CMS</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.href ? (
                  <Link href={item.href}>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      item.isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.icon}
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {typeof item.badge === 'string' ? item.badge : item.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ) : item.onClick ? (
                  <div 
                    onClick={item.onClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                      item.isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {typeof item.badge === 'string' ? item.badge : item.badge}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Menu */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-6 w-6 mr-3">
                  <AvatarFallback className="text-xs">
                    {user ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium">
                    {user?.name || 'Guest User'}
                  </div>
                  {user?.role && (
                    <div className="text-xs text-muted-foreground">
                      {user.role}
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-10 pr-4 py-2 w-64 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}