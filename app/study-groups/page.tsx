"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Plus, Search, MessageSquare, BookOpen, Star, Share2, Eye } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface StudyGroup {
  id: string
  name: string
  subject: string
  description: string
  members: number
  maxMembers: number
  isPrivate: boolean
  tags: string[]
  createdBy: string
  avatar: string
  lastActivity: string
  highlights: number
  notes: number
}

interface GroupNote {
  id: string
  title: string
  content: string
  author: string
  highlights: number
  isHighlighted: boolean
  createdAt: Date
}

export default function StudyGroupsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [newGroup, setNewGroup] = useState({
    name: "",
    subject: "",
    description: "",
    maxMembers: 10,
    isPrivate: false,
  })

  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: "1",
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description: "Weekly study sessions for DSA concepts, coding practice, and interview prep",
      members: 12,
      maxMembers: 15,
      isPrivate: false,
      tags: ["DSA", "Coding", "Interviews"],
      createdBy: "Alex Chen",
      avatar: "/diverse-group-avatars.png",
      lastActivity: "2 hours ago",
      highlights: 23,
      notes: 45,
    },
    {
      id: "2",
      name: "Operating Systems Study Circle",
      subject: "Computer Science",
      description: "Deep dive into OS concepts, process management, and system calls",
      members: 8,
      maxMembers: 12,
      isPrivate: false,
      tags: ["OS", "Systems", "Theory"],
      createdBy: "Sarah Kim",
      avatar: "/os-group.png",
      lastActivity: "5 hours ago",
      highlights: 18,
      notes: 32,
    },
    {
      id: "3",
      name: "Calculus Problem Solving",
      subject: "Mathematics",
      description: "Collaborative problem solving for calculus assignments and exam prep",
      members: 15,
      maxMembers: 20,
      isPrivate: false,
      tags: ["Calculus", "Math", "Problem Solving"],
      createdBy: "Mike Johnson",
      avatar: "/math-group.png",
      lastActivity: "1 day ago",
      highlights: 31,
      notes: 67,
    },
  ])

  const [groupNotes] = useState<GroupNote[]>([
    {
      id: "1",
      title: "Binary Search Implementation",
      content: "Here's a clean implementation of binary search with detailed comments...",
      author: "Alex Chen",
      highlights: 12,
      isHighlighted: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Process Scheduling Algorithms",
      content: "Comparison of FCFS, SJF, and Round Robin scheduling algorithms...",
      author: "Sarah Kim",
      highlights: 8,
      isHighlighted: false,
      createdAt: new Date(),
    },
  ])

  const filteredGroups = studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const createGroup = () => {
    // Implementation for creating a new group
    console.log("Creating group:", newGroup)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Study Groups</h1>
                <p className="text-muted-foreground">Collaborate, share notes, and learn together</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Study Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Group name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    />
                    <Input
                      placeholder="Subject"
                      value={newGroup.subject}
                      onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    />
                    <Button onClick={createGroup} className="w-full">
                      Create Group
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">All Subjects</Button>
              <Button variant="outline">My Groups</Button>
            </div>

            {/* Study Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="glassmorphism border-0 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={group.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            <Users className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{group.subject}</p>
                        </div>
                      </div>
                      {!group.isPrivate && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members}/{group.maxMembers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {group.highlights}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {group.notes}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">by {group.createdBy}</span>
                      <span className="text-xs text-muted-foreground">{group.lastActivity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Shared Notes Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Recent Shared Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupNotes.map((note) => (
                  <Card key={note.id} className="glassmorphism border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {note.isHighlighted && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                          {note.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {note.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{note.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-4 w-4" />
                          {note.highlights}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Group Detail Modal */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedGroup?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {selectedGroup?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{selectedGroup?.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedGroup?.members}</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedGroup?.notes}</div>
                <div className="text-sm text-muted-foreground">Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedGroup?.highlights}</div>
                <div className="text-sm text-muted-foreground">Highlights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Users className="h-4 w-4 mr-2" />
                Join Group
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
