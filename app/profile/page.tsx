"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Mail,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Upload,
  MessageSquare,
  HelpCircle,
  Download,
  Star,
  Eye,
  Clock,
  TrendingUp,
} from "lucide-react"

const userStats = [
  { label: "Resources Uploaded", value: 23, icon: Upload, color: "text-blue-600" },
  { label: "Total Downloads", value: 1247, icon: Download, color: "text-green-600" },
  { label: "Forum Posts", value: 89, icon: MessageSquare, color: "text-purple-600" },
  { label: "Requests Made", value: 12, icon: HelpCircle, color: "text-orange-600" },
]

const uploadedResources = [
  {
    id: 1,
    title: "Advanced Calculus Complete Notes",
    subject: "Mathematics",
    type: "PDF",
    downloads: 234,
    rating: 4.8,
    uploadedAt: "2 weeks ago",
    status: "published",
  },
  {
    id: 2,
    title: "Data Structures Implementation Guide",
    subject: "Computer Science",
    type: "PDF",
    downloads: 156,
    rating: 4.6,
    uploadedAt: "1 month ago",
    status: "published",
  },
  {
    id: 3,
    title: "Physics Lab Manual Draft",
    subject: "Physics",
    type: "DOCX",
    downloads: 0,
    rating: 0,
    uploadedAt: "3 days ago",
    status: "draft",
  },
]

const recentRequests = [
  {
    id: 1,
    title: "Linear Algebra Problem Sets",
    status: "fulfilled",
    upvotes: 23,
    createdAt: "1 week ago",
  },
  {
    id: 2,
    title: "Organic Chemistry Lab Manual",
    status: "open",
    upvotes: 15,
    createdAt: "2 weeks ago",
  },
  {
    id: 3,
    title: "Machine Learning Tutorials",
    status: "in-progress",
    upvotes: 31,
    createdAt: "1 month ago",
  },
]

const achievements = [
  {
    title: "Top Contributor",
    description: "Uploaded 20+ high-quality resources",
    icon: Award,
    earned: true,
    date: "2 weeks ago",
  },
  {
    title: "Community Helper",
    description: "Helped fulfill 10+ resource requests",
    icon: HelpCircle,
    earned: true,
    date: "1 month ago",
  },
  {
    title: "Popular Creator",
    description: "Resources downloaded 1000+ times",
    icon: TrendingUp,
    earned: true,
    date: "3 weeks ago",
  },
  {
    title: "Forum Expert",
    description: "Made 100+ helpful forum posts",
    icon: MessageSquare,
    earned: false,
    date: null,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-500/10 text-green-600"
    case "draft":
      return "bg-yellow-500/10 text-yellow-600"
    case "fulfilled":
      return "bg-green-500/10 text-green-600"
    case "open":
      return "bg-blue-500/10 text-blue-600"
    case "in-progress":
      return "bg-orange-500/10 text-orange-600"
    default:
      return "bg-gray-500/10 text-gray-600"
  }
}

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6 space-y-8">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl"></div>
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src="/diverse-student-profiles.png" alt="John Doe" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">John Doe</h1>
                      <p className="text-muted-foreground">Computer Science Student</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>john.doe@college.edu</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined March 2024</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Semester 6</span>
                      </div>
                    </div>

                    <Button className="w-full">Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${achievement.earned ? "bg-accent/10" : "bg-muted/50"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? "bg-accent text-accent-foreground" : "bg-muted"}`}
                      >
                        <achievement.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${!achievement.earned && "text-muted-foreground"}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-accent mt-1">Earned {achievement.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="resources" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resources">My Resources</TabsTrigger>
                  <TabsTrigger value="requests">My Requests</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Uploaded Resources</h2>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {uploadedResources.map((resource) => (
                      <Card key={resource.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">{resource.title}</h3>
                                <Badge variant="outline">{resource.type}</Badge>
                                <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {resource.subject} • Uploaded {resource.uploadedAt}
                              </p>
                              {resource.status === "published" && (
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Download className="h-4 w-4" />
                                    {resource.downloads} downloads
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {resource.rating}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Requests</h2>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">{request.title}</h3>
                                <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {request.upvotes} upvotes
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  Created {request.createdAt}
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>

                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Upload className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Uploaded a new resource</p>
                            <p className="text-sm text-muted-foreground">Advanced Calculus Complete Notes</p>
                            <p className="text-xs text-muted-foreground">2 weeks ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Posted in Mathematics forum</p>
                            <p className="text-sm text-muted-foreground">Help with Integration by Parts</p>
                            <p className="text-xs text-muted-foreground">3 weeks ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <HelpCircle className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">Made a resource request</p>
                            <p className="text-sm text-muted-foreground">Linear Algebra Problem Sets</p>
                            <p className="text-xs text-muted-foreground">1 month ago</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
