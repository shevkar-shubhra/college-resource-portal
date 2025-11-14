"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ResourceGridCard } from "@/components/resources/ResourceGridCard";
import { ResourceListCard } from "@/components/resources/ResourceListCard";
import { ResourcePreviewModal } from "@/components/resources/ResourcePreviewModal";

type ResourceItem = {
  id: string;
  title: string;
  description?: string | null;
  subject?: string | null;
  semester?: string | null;
  faculty?: string | null;
  type?: string | null;
  size?: string | number | null;
  downloads?: number;
  rating?: number;
  uploadedBy?: string | null;
  timeAgo?: string | null;
  tags?: string[] | null;
  fileName?: string | null;
  downloadUrl?: string | null;
};

const subjects = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Computer Science", "Biology"];
const semesters = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4"];
const fileTypes = ["All Types", "PDF", "DOCX", "PPT", "MP4", "ZIP"];

export default function ResourcesPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedFileType, setSelectedFileType] = useState("All Types");

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [errorResources, setErrorResources] = useState<string | null>(null);

  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  // load resources from backend (single focused step)
  useEffect(() => {
    let mounted = true;

    async function loadResources() {
      setLoadingResources(true);
      setErrorResources(null);
      try {
        const res = await fetch("/api/resources");
        const json = await res.json();
        if (!res.ok || json?.ok === false) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
        // expect json.items to be ResourceItem[]
        if (mounted) setResources(json.items || []);
      } catch (err: any) {
        console.error("Failed to fetch resources:", err);
        if (mounted) setErrorResources(err.message || String(err));
      } finally {
        if (mounted) setLoadingResources(false);
      }
    }

    loadResources();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRating = (resourceId: string, rating: number) => {
    setUserRatings((prev) => ({ ...prev, [resourceId]: rating }));
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      !q ||
      resource.title.toLowerCase().includes(q) ||
      (resource.description ?? "").toLowerCase().includes(q) ||
      (resource.tags ?? []).some((tag) => tag.toLowerCase().includes(q));

    const matchesSubject = selectedSubject === "All Subjects" || resource.subject === selectedSubject;
    const matchesSemester = selectedSemester === "All Semesters" || resource.semester === selectedSemester;
    const matchesFileType = selectedFileType === "All Types" || resource.type === selectedFileType;

    return matchesSearch && matchesSubject && matchesSemester && matchesFileType;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

      <div className={cn("flex-1 transition-all duration-300", isCollapsed ? "lg:ml-16" : "lg:ml-64")}>
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif mb-2">Resources</h1>
            <p className="text-muted-foreground">Discover and download study materials shared by your peers</p>
          </div>

          {/* Filters and Search Component */}
          <ResourceFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            selectedFileType={selectedFileType}
            onFileTypeChange={setSelectedFileType}
            subjects={subjects}
            semesters={semesters}
            fileTypes={fileTypes}
          />

          {/* Results / Loading / Error */}
          <div className="mb-4">
            {loadingResources ? (
              <p className="text-sm text-muted-foreground">Loading resources…</p>
            ) : errorResources ? (
              <p className="text-sm text-destructive">Failed to load: {errorResources}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Showing {filteredResources.length} of {resources.length} resources
              </p>
            )}
          </div>

          {/* Resources Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceGridCard
                  key={resource.id}
                  resource={resource as any}
                  userRating={userRatings[resource.id] || 0}
                  onRate={(rating) => handleRating(resource.id, rating)}
                  onPreview={() => setPreviewResource(resource)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <ResourceListCard
                  key={resource.id}
                  resource={resource as any}
                  userRating={userRatings[resource.id] || 0}
                  onRate={(rating) => handleRating(resource.id, rating)}
                  onPreview={() => setPreviewResource(resource)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Preview Modal Component */}
      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource as any}
          userRating={userRatings[previewResource.id] || 0}
          onRate={(rating) => handleRating(previewResource.id, rating)}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
}
