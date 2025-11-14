"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  BookOpen,
  Upload,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Star,
  Download,
  Eye,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "Browse Resources",
    description: "Explore study materials and resources",
    icon: BookOpen,
    href: "/resources",
    color: "bg-blue-500",
  },
  {
    title: "Upload Resource",
    description: "Share your study materials",
    icon: Upload,
    href: "/upload",
    color: "bg-green-500",
  },
  {
    title: "Join Forum",
    description: "Discuss with fellow students",
    icon: MessageSquare,
    href: "/forum",
    color: "bg-purple-500",
  },
  {
    title: "Make Request",
    description: "Request specific resources",
    icon: HelpCircle,
    href: "/requests",
    color: "bg-orange-500",
  },
]

const recentResources = [
  {
    title: "Advanced Calculus Notes",
    subject: "Mathematics",
    type: "PDF",
    downloads: 234,
    rating: 4.8,
    uploadedBy: "Sarah Chen",
    timeAgo: "2 hours ago",
  },
  {
    title: "Physics Lab Manual",
    subject: "Physics",
    type: "DOCX",
    downloads: 156,
    rating: 4.6,
    uploadedBy: "Mike Johnson",
    timeAgo: "5 hours ago",
  },
  {
    title: "Chemistry Reaction Guide",
    subject: "Chemistry",
    type: "PPT",
    downloads: 89,
    rating: 4.9,
    uploadedBy: "Emma Davis",
    timeAgo: "1 day ago",
  },
]

const trendingTopics = [
  { name: "Machine Learning", posts: 45, trend: "+12%" },
  { name: "Data Structures", posts: 38, trend: "+8%" },
  { name: "Organic Chemistry", posts: 29, trend: "+15%" },
  { name: "Linear Algebra", posts: 24, trend: "+5%" },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6 space-y-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold font-serif mb-2">Welcome back, John! 🎓</h1>
              <p className="text-muted-foreground text-lg mb-6">
                Ready to explore new resources and connect with your peers?
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <TrendingUp className="h-4 w-4 mr-1" />5 new resources this week
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Users className="h-4 w-4 mr-1" />
                  12 active discussions
                </Badge>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-32 translate-x-32"></div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-6">
                      <div
                        className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                      <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Resources */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Recently Added</h2>
                <Link href="/resources">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentResources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{resource.title}</h3>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.subject} • Uploaded by {resource.uploadedBy}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {resource.downloads}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {resource.timeAgo}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Study Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Progress</CardTitle>
                  <CardDescription>Your learning journey this semester</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Resources Downloaded</span>
                      <span>23/30</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Forum Participation</span>
                      <span>15/20</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Requests Fulfilled</span>
                      <span>8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                  <CardDescription>Popular discussions this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-sm">{topic.name}</p>
                        <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {topic.trend}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
