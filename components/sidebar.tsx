"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  BookOpen,
  Upload,
  MessageSquare,
  HelpCircle,
  User,
  Settings,
  Menu,
  X,
  Leaf,
  ShoppingBag,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Requests", href: "/requests", icon: HelpCircle },
  { name: "Forum", href: "/forum", icon: MessageSquare },
  { name: "My Space", href: "/my-space", icon: Brain },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
]

const bottomNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={cn(
              "flex items-center border-b border-sidebar-border transition-all duration-300",
              isCollapsed ? "px-4 py-4 justify-center" : "px-6 py-4",
            )}
          >
            <Leaf className="h-8 w-8 text-accent" />
            {!isCollapsed && (
              <span className="text-xl font-bold font-serif text-sidebar-foreground ml-3">EduPortal</span>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <div className="hidden lg:flex justify-end p-2">
            <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn("flex-1 py-6 space-y-1", isCollapsed ? "px-2" : "px-4")}>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                    isCollapsed ? "px-3 py-3 justify-center w-12 h-12 mx-auto" : "px-3 py-2",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.name}
                </Link>
              )
            })}
          </nav>

          {/* Bottom navigation */}
          <div className={cn("py-4 border-t border-sidebar-border space-y-1", isCollapsed ? "px-2" : "px-4")}>
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
                    isCollapsed ? "px-3 py-3 justify-center w-12 h-12 mx-auto" : "px-3 py-2",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
