"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Sun, Moon, LogOut, User, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRef } from "react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const themeButtonRef = useRef<HTMLButtonElement>(null)

  const handleThemeToggle = () => {
    if (!themeButtonRef.current) return

    const button = themeButtonRef.current
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Create wave element
    const wave = document.createElement("div")
    wave.style.position = "fixed"
    wave.style.left = `${x}px`
    wave.style.top = `${y}px`
    wave.style.width = "0"
    wave.style.height = "0"
    wave.style.borderRadius = "50%"
    wave.style.background = theme === "dark" ? "#ffffff" : "#000000"
    wave.style.zIndex = "9999"
    wave.style.pointerEvents = "none"
    wave.style.transform = "translate(-50%, -50%)"
    wave.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"

    document.body.appendChild(wave)

    // Trigger animation
    requestAnimationFrame(() => {
      const maxDimension = Math.max(window.innerWidth, window.innerHeight)
      wave.style.width = `${maxDimension * 2}px`
      wave.style.height = `${maxDimension * 2}px`
      wave.style.opacity = "0.1"
    })

    // Change theme after a short delay
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
    }, 150)

    // Clean up
    setTimeout(() => {
      document.body.removeChild(wave)
    }, 600)
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources, forums, requests..."
              className="pl-10 bg-muted/50 border-0 focus:bg-background"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            ref={themeButtonRef}
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="hover:bg-accent/20 transition-all duration-200 hover:scale-110"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/20 relative transition-all duration-200 hover:scale-110"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full transition-all duration-200 hover:scale-110"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/diverse-user-avatars.png" alt="Student" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@college.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
