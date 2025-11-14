"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { MessageSquare, Clock, TrendingUp, Pin, ArrowRight, Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    description: "Calculus, Linear Algebra, Statistics, and more",
    threads: 156,
    posts: 1240,
    lastActivity: "2 minutes ago",
    color: "bg-blue-500",
    trending: true,
  },
  {
    id: 2,
    name: "Computer Science",
    description: "Programming, Algorithms, Data Structures, AI/ML",
    threads: 203,
    posts: 1890,
    lastActivity: "5 minutes ago",
    color: "bg-green-500",
    trending: true,
  },
  {
    id: 3,
    name: "Physics",
    description: "Mechanics, Thermodynamics, Quantum Physics",
    threads: 89,
    posts: 567,
    lastActivity: "12 minutes ago",
    color: "bg-purple-500",
    trending: false,
  },
  {
    id: 4,
    name: "Chemistry",
    description: "Organic, Inorganic, Physical Chemistry",
    threads: 124,
    posts: 892,
    lastActivity: "18 minutes ago",
    color: "bg-orange-500",
    trending: true,
  },
  {
    id: 5,
    name: "Biology",
    description: "Cell Biology, Genetics, Ecology, Anatomy",
    threads: 67,
    posts: 445,
    lastActivity: "25 minutes ago",
    color: "bg-pink-500",
    trending: false,
  },
  {
    id: 6,
    name: "Engineering",
    description: "Mechanical, Electrical, Civil Engineering",
    threads: 98,
    posts: 723,
    lastActivity: "1 hour ago",
    color: "bg-indigo-500",
    trending: false,
  },
]

const pinnedThreads = [
  {
    id: 1,
    title: "Welcome to EduPortal Forum - Community Guidelines",
    author: "Admin",
    replies: 45,
    views: 1250,
    lastReply: "2 days ago",
    isPinned: true,
  },
  {
    id: 2,
    title: "Study Group Formation for Final Exams",
    author: "Sarah Chen",
    replies: 23,
    views: 456,
    lastReply: "3 hours ago",
    isPinned: true,
  },
]

const recentThreads = [
  {
    id: 3,
    title: "Help with Calculus Integration Problems",
    author: "Mike Johnson",
    subject: "Mathematics",
    replies: 12,
    views: 89,
    lastReply: "15 minutes ago",
    isHot: true,
  },
  {
    id: 4,
    title: "Best Resources for Learning React.js",
    author: "Emma Davis",
    subject: "Computer Science",
    replies: 8,
    views: 156,
    lastReply: "32 minutes ago",
    isHot: false,
  },
  {
    id: 5,
    title: "Organic Chemistry Lab Report Help",
    author: "Alex Kumar",
    subject: "Chemistry",
    replies: 5,
    views: 67,
    lastReply: "1 hour ago",
    isHot: false,
  },
]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif mb-2">Discussion Forum</h1>
              <p className="text-muted-foreground">Connect with peers, ask questions, and share knowledge</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Pinned Threads */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Pin className="h-5 w-5 text-primary" />
              Pinned Discussions
            </h2>
            <div className="space-y-3">
              {pinnedThreads.map((thread) => (
                <Card key={thread.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Pin className="h-4 w-4 text-primary" />
                        <div>
                          <h3 className="font-semibold hover:text-primary cursor-pointer">{thread.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {thread.author} • {thread.replies} replies • {thread.views} views
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{thread.lastReply}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subject Categories */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-6">Subject Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject) => (
                  <Link key={subject.id} href={`/forum/${subject.name.toLowerCase()}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <MessageSquare className="h-6 w-6 text-white" />
                          </div>
                          {subject.trending && (
                            <Badge variant="secondary" className="bg-accent/20 text-accent">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>{subject.threads} threads</span>
                            <span>{subject.posts} posts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {subject.lastActivity}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-primary mt-4 group-hover:translate-x-1 transition-transform" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentThreads.map((thread) => (
                  <Card key={thread.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/abstract-geometric-shapes.png?height=32&width=32&query=${thread.author}`} />
                          <AvatarFallback>
                            {thread.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm hover:text-primary cursor-pointer line-clamp-1">
                              {thread.title}
                            </h4>
                            {thread.isHot && (
                              <Badge variant="destructive" className="text-xs">
                                Hot
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            in {thread.subject} by {thread.author}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{thread.replies} replies</span>
                            <span>{thread.views} views</span>
                            <span>{thread.lastReply}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full bg-transparent">
                  View All Recent Activity
                </Button>
              </div>

              {/* Forum Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Forum Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Threads</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                    <span className="font-semibold">8,934</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="font-semibold">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Online Now</span>
                    <span className="font-semibold text-accent">23</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
