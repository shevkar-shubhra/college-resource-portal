"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ArrowUp, Clock, Plus, Search, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const requests = [
  {
    id: 1,
    title: "Advanced Machine Learning Notes - CS 6780",
    description:
      "Looking for comprehensive notes covering neural networks, deep learning, and reinforcement learning from Professor Anderson's class.",
    subject: "Computer Science",
    semester: "Semester 6",
    requestedBy: "Sarah Chen",
    timeAgo: "2 hours ago",
    upvotes: 23,
    comments: 5,
    status: "open",
    priority: "high",
    tags: ["machine-learning", "neural-networks", "deep-learning"],
  },
  {
    id: 2,
    title: "Organic Chemistry Lab Manual - CHEM 3410",
    description:
      "Need the complete lab manual with procedures and safety guidelines for organic chemistry experiments.",
    subject: "Chemistry",
    semester: "Semester 4",
    requestedBy: "Mike Johnson",
    timeAgo: "5 hours ago",
    upvotes: 18,
    comments: 3,
    status: "open",
    priority: "medium",
    tags: ["organic-chemistry", "lab-manual", "experiments"],
  },
  {
    id: 3,
    title: "Linear Algebra Problem Sets with Solutions",
    description:
      "Looking for practice problems and detailed solutions for eigenvalues, eigenvectors, and matrix operations.",
    subject: "Mathematics",
    semester: "Semester 3",
    requestedBy: "Emma Davis",
    timeAgo: "1 day ago",
    upvotes: 31,
    comments: 8,
    status: "fulfilled",
    priority: "medium",
    tags: ["linear-algebra", "problem-sets", "solutions"],
  },
  {
    id: 4,
    title: "Physics Simulation Software Tutorial",
    description: "Need tutorials or guides for using MATLAB/Simulink for physics simulations and modeling.",
    subject: "Physics",
    semester: "Semester 5",
    requestedBy: "Alex Kumar",
    timeAgo: "2 days ago",
    upvotes: 15,
    comments: 12,
    status: "in-progress",
    priority: "low",
    tags: ["physics", "simulation", "matlab", "tutorial"],
  },
  {
    id: 5,
    title: "Database Design Project Examples",
    description: "Looking for sample database design projects with ER diagrams and SQL implementations for reference.",
    subject: "Computer Science",
    semester: "Semester 4",
    requestedBy: "Lisa Wang",
    timeAgo: "3 days ago",
    upvotes: 27,
    comments: 6,
    status: "open",
    priority: "high",
    tags: ["database", "sql", "er-diagrams", "projects"],
  },
  {
    id: 6,
    title: "Anatomy Atlas with High-Resolution Images",
    description:
      "Need detailed anatomical diagrams and images for human anatomy course, especially cardiovascular system.",
    subject: "Biology",
    semester: "Semester 2",
    requestedBy: "Tom Rodriguez",
    timeAgo: "1 week ago",
    upvotes: 12,
    comments: 4,
    status: "open",
    priority: "medium",
    tags: ["anatomy", "biology", "cardiovascular", "diagrams"],
  },
]

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"]
const statuses = ["All Status", "open", "in-progress", "fulfilled"]
const sortOptions = ["Most Recent", "Most Upvoted", "Most Commented"]

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-500/10 text-blue-600 border-blue-200"
    case "in-progress":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
    case "fulfilled":
      return "bg-green-500/10 text-green-600 border-green-200"
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 border-red-200"
    case "medium":
      return "bg-orange-500/10 text-orange-600 border-orange-200"
    case "low":
      return "bg-green-500/10 text-green-600 border-green-200"
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "fulfilled":
      return CheckCircle
    case "in-progress":
      return AlertCircle
    default:
      return Clock
  }
}

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("Most Recent")
  const [upvotedRequests, setUpvotedRequests] = useState<Set<number>>(new Set())

  const handleUpvote = (requestId: number) => {
    setUpvotedRequests((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(requestId)) {
        newSet.delete(requestId)
      } else {
        newSet.add(requestId)
      }
      return newSet
    })
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSubject = selectedSubject === "All Subjects" || request.subject === selectedSubject
    const matchesStatus = selectedStatus === "All Status" || request.status === selectedStatus

    return matchesSearch && matchesSubject && matchesStatus
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif mb-2">Resource Requests</h1>
              <p className="text-muted-foreground">Request specific resources or help fulfill others' requests</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests, descriptions, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status)
              const isUpvoted = upvotedRequests.has(request.id)

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Upvote Section */}
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          variant={isUpvoted ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleUpvote(request.id)}
                          className={`w-12 h-12 rounded-full ${isUpvoted ? "bg-accent hover:bg-accent/90" : ""}`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold">{request.upvotes + (isUpvoted ? 1 : 0)}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 hover:text-primary cursor-pointer">
                              {request.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">{request.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={getStatusColor(request.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {request.status}
                            </Badge>
                            <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">{request.subject}</Badge>
                          <Badge variant="secondary">{request.semester}</Badge>
                          {request.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={`/abstract-geometric-shapes.png?height=24&width=24&query=${request.requestedBy}`}
                                />
                                <AvatarFallback className="text-xs">
                                  {request.requestedBy
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{request.requestedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {request.timeAgo}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {request.comments} comments
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Comment
                            </Button>
                            {request.status === "open" && (
                              <Button size="sm" className="bg-accent hover:bg-accent/90">
                                Help Fulfill
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">+12 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fulfilled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">189</div>
                <p className="text-xs text-muted-foreground">76% success rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">34</div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
