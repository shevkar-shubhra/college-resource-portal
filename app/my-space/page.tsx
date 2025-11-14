"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  Download,
  Bell,
  Grid3X3,
  List,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

interface Todo {
  id: string
  title: string
  content: string
  completed: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
  dueDate?: Date
}

type CalendarView = "monthly" | "weekly" | "daily"

export default function MySpacePage() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Complete OS Assignment",
      content:
        "Finish the process scheduling algorithms assignment. Focus on FCFS, SJF, and Round Robin algorithms. Include diagrams and examples.",
      completed: false,
      priority: "high",
      createdAt: new Date(),
      dueDate: new Date(2025, 0, 22), // Jan 22, 2025
    },
    {
      id: "2",
      title: "Review Data Structures",
      content: "Go through linked lists, stacks, queues, and trees. Practice implementation in C++.",
      completed: true,
      priority: "medium",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Prepare for Math Quiz",
      content: "Study calculus derivatives and integrals. Review practice problems from chapter 5-7.",
      completed: false,
      priority: "high",
      createdAt: new Date(),
      dueDate: new Date(2025, 0, 28), // Jan 28, 2025
    },
    {
      id: "4",
      title: "Database Project",
      content: "Design and implement a library management system using MySQL and PHP.",
      completed: false,
      priority: "medium",
      createdAt: new Date(),
      dueDate: new Date(2025, 1, 5), // Feb 5, 2025
    },
    {
      id: "5",
      title: "Research Paper",
      content: "Write a research paper on machine learning applications in healthcare.",
      completed: false,
      priority: "low",
      createdAt: new Date(),
      dueDate: new Date(2025, 1, 15), // Feb 15, 2025
    },
  ])

  const [newTodo, setNewTodo] = useState({ title: "", content: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isNotesPanel, setIsNotesPanel] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [calendarView, setCalendarView] = useState<CalendarView>("monthly")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isTaskDialog, setIsTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", content: "", priority: "medium" as const })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault()
        setIsNotesPanel(true)
        setNewTodo({ title: "", content: "" })
      }
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        setIsNotesPanel(true)
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
          if (searchInput) searchInput.focus()
        }, 100)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const addTodo = () => {
    if (newTodo.title.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          title: newTodo.title,
          content: newTodo.content,
          completed: false,
          priority: "medium",
          createdAt: new Date(),
        },
      ])
      setNewTodo({ title: "", content: "" })
      setIsNotesPanel(false)
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    setSelectedTodo(null)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const getTasksForDate = (day: number) => {
    if (!day) return []
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return todos.filter(
      (todo) =>
        todo.dueDate &&
        todo.dueDate.getDate() === day &&
        todo.dueDate.getMonth() === currentMonth.getMonth() &&
        todo.dueDate.getFullYear() === currentMonth.getFullYear(),
    )
  }

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getUpcomingTasks = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return todos
      .filter((todo) => todo.dueDate && todo.dueDate >= today && todo.dueDate <= nextWeek && !todo.completed)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
  }

  const handleDateClick = (day: number) => {
    if (!day) return
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(selectedDate)
    setIsTaskDialog(true)
    setNewTask({ title: "", content: "", priority: "medium" })
  }

  const addTaskToDate = () => {
    if (newTask.title.trim() && selectedDate) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          title: newTask.title,
          content: newTask.content,
          completed: false,
          priority: newTask.priority,
          createdAt: new Date(),
          dueDate: selectedDate,
        },
      ])
      setNewTask({ title: "", content: "", priority: "medium" })
      setIsTaskDialog(false)
      setSelectedDate(null)
    }
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
          <div className="grid grid-cols-12 gap-6 h-full max-w-7xl mx-auto">
            {/* Left Column - Todo List */}
            <div className="col-span-4 space-y-6">
              <Card className="glassmorphism border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Todo List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-lg glassmorphism hover:bg-accent/5 cursor-pointer transition-colors"
                        onClick={() => setSelectedTodo(todo)}
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={(checked) => {
                            toggleTodo(todo.id)
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        />
                        <div className="flex-1">
                          <span className={`block ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                            {todo.title}
                          </span>
                          {todo.dueDate && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              Due {todo.dueDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <Badge
                          variant={
                            todo.priority === "high"
                              ? "destructive"
                              : todo.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {todo.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Quick Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-3 flex flex-col items-center justify-center min-h-24 hover:border-accent transition-colors cursor-pointer group"
                      onClick={() => setIsNotesPanel(true)}
                    >
                      <Plus className="h-4 w-4 text-muted-foreground mb-1 group-hover:text-accent transition-colors" />
                      <span className="text-xs text-muted-foreground group-hover:text-accent transition-colors">
                        Add Note
                      </span>
                    </div>
                    {todos.slice(0, 3).map((todo, index) => (
                      <div
                        key={todo.id}
                        className={cn(
                          "rounded-lg p-3 min-h-24 cursor-pointer shadow-sm hover:shadow-md transition-all transform hover:scale-105",
                          index % 3 === 0
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : index % 3 === 1
                              ? "bg-pink-100 dark:bg-pink-900/20"
                              : "bg-blue-100 dark:bg-blue-900/20",
                        )}
                        onClick={() => setSelectedTodo(todo)}
                      >
                        <h4 className="font-medium text-xs mb-1 line-clamp-2">{todo.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{todo.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Enhanced Calendar */}
            <div className="col-span-8">
              <Card className="glassmorphism border-0 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-2xl font-semibold">Tasks Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={calendarView === "monthly" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCalendarView("monthly")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Today
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={calendarView === "monthly" ? "default" : "outline"}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white px-4"
                    >
                      Monthly
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="h-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-xl font-semibold">
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground p-4 border-b">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 flex-1">
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const tasksForDay = getTasksForDate(day || 0)
                      const isToday =
                        day === new Date().getDate() &&
                        currentMonth.getMonth() === new Date().getMonth() &&
                        currentMonth.getFullYear() === new Date().getFullYear()

                      return (
                        <div
                          key={index}
                          className={cn(
                            "min-h-24 p-3 border border-border/50 hover:bg-accent/10 cursor-pointer transition-all duration-200 flex flex-col",
                            day === null
                              ? "text-transparent cursor-default hover:bg-transparent"
                              : "hover:border-accent",
                            isToday && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
                          )}
                          onClick={() => day && handleDateClick(day)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isToday && "text-blue-600 dark:text-blue-400 font-semibold",
                              )}
                            >
                              {day}
                            </span>
                            {tasksForDay.length > 0 && (
                              <div className="flex gap-1">
                                {tasksForDay.slice(0, 2).map((task, i) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      task.priority === "high"
                                        ? "bg-red-500"
                                        : task.priority === "medium"
                                          ? "bg-orange-500"
                                          : "bg-blue-500",
                                    )}
                                  />
                                ))}
                                {tasksForDay.length > 2 && (
                                  <span className="text-xs text-muted-foreground">+{tasksForDay.length - 2}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            {tasksForDay.slice(0, 2).map((task, i) => (
                              <div key={i} className="text-xs p-1 rounded bg-accent/20 text-accent-foreground truncate">
                                {task.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-30">
                    <Button variant="outline" size="sm" className="rounded-full w-12 h-12 shadow-lg bg-background">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full w-12 h-12 shadow-lg bg-background">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {!isNotesPanel && (
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700 z-50"
          onClick={() => setIsNotesPanel(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-40",
          isNotesPanel ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg font-semibold text-purple-600">Notes Panel</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsNotesPanel(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4 h-full overflow-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes... (Ctrl+/)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Note title..."
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              />
              <Textarea
                placeholder="Note content..."
                value={newTodo.content}
                onChange={(e) => setNewTodo({ ...newTodo, content: e.target.value })}
                rows={3}
              />
              <Button onClick={addTodo} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Note (Ctrl+M)
              </Button>
            </div>

            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-3 rounded-lg border hover:bg-accent/5 cursor-pointer"
                  onClick={() => setSelectedTodo(todo)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="font-medium text-sm">{todo.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Star className="h-3 w-3 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTodo(todo.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{todo.content}</p>
                  <span className="text-xs text-muted-foreground">Updated 1m ago</span>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-muted-foreground mt-4">
              {filteredTodos.length} of {todos.length} notes
              <div className="mt-2 text-xs">Tip: Press Ctrl+M to add new note, Ctrl+/ to search</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isTaskDialog} onOpenChange={setIsTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Add Task for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Task description..."
              value={newTask.content}
              onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
              rows={3}
            />
            <Select
              value={newTask.priority}
              onValueChange={(value: "low" | "medium" | "high") => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsTaskDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addTaskToDate} className="flex-1">
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTodo} onOpenChange={() => setSelectedTodo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              {selectedTodo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedTodo?.priority === "high"
                    ? "destructive"
                    : selectedTodo?.priority === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {selectedTodo?.priority} priority
              </Badge>
              <Badge variant="outline">{selectedTodo?.completed ? "Completed" : "In Progress"}</Badge>
              {selectedTodo?.dueDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due {selectedTodo.dueDate.toLocaleDateString()}
                </Badge>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedTodo?.content || "No description provided."}
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-xs text-muted-foreground">
                Created {selectedTodo?.createdAt.toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => selectedTodo && deleteTodo(selectedTodo.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
