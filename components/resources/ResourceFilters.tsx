"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid3X3, List } from "lucide-react"

type ResourceFiltersProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  selectedSubject: string
  onSubjectChange: (value: string) => void
  selectedSemester: string
  onSemesterChange: (value: string) => void
  selectedFileType: string
  onFileTypeChange: (value: string) => void
  subjects: string[]
  semesters: string[]
  fileTypes: string[]
}

export function ResourceFilters({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  selectedSubject,
  onSubjectChange,
  selectedSemester,
  onSemesterChange,
  selectedFileType,
  onFileTypeChange,
  subjects,
  semesters,
  fileTypes,
}: ResourceFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
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

        <Select value={selectedSemester} onValueChange={onSemesterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedFileType} onValueChange={onFileTypeChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}