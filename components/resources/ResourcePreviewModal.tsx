// components/resources/ResourcePreviewModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Clock, User, X, FileText, Video, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import { Resource } from "@/app/resources/data" // Adjust path as needed
import { getFileIcon } from "@/app/resources/utils" // Adjust path as needed
import { useState } from "react"

type ResourcePreviewModalProps = {
  resource: Resource
  userRating: number
  onRate: (rating: number) => void
  onClose: () => void
}

/** Mock preview UI component (keeps presentational logic separate).
 *  Accepts a possibly-unknown `type` (string | undefined) and renders fallback if missing.
 */
function MockPreview({ type }: { type?: string | null }) {
  const t = type ?? "unknown"

  if (t === "PDF" || t === "DOCX") {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((page) => (
          <div key={page} className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Page {page}</span>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Preview showing 3 of {Math.floor(Math.random() * 20) + 10} pages</p>
        </div>
      </div>
    )
  }

  if (t === "PPT") {
    return (
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((slide) => (
            <div key={slide} className="bg-white border rounded-lg shadow-sm overflow-hidden aspect-video">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-full p-4 flex flex-col justify-center items-center">
                <div className="h-6 bg-gradient-to-r from-blue-300 to-purple-300 rounded w-3/4 mb-4"></div>
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">Slide {slide}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Preview showing 4 of {Math.floor(Math.random() * 30) + 15} slides</p>
        </div>
      </div>
    )
  }

  if (t === "MP4") {
    return (
      <div className="bg-black aspect-video flex items-center justify-center relative">
        <Video className="h-20 w-20 text-white/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>
    )
  }

  if (t === "ZIP") {
    return (
      <div className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Archive className="h-20 w-20 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground mb-2">Archive Contents</p>
        </div>
      </div>
    )
  }

  const FileIcon = getFileIcon(t)
  return (
    <div className="p-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FileIcon className="h-20 w-20 text-muted-foreground/40" />
        <p className="text-lg font-medium text-muted-foreground mb-1">{t} Preview</p>
        <p className="text-sm text-muted-foreground/60">Full preview available after download</p>
      </div>
    </div>
  )
}

export function ResourcePreviewModal({ resource, userRating, onRate, onClose }: ResourcePreviewModalProps) {
  // FileIcon: pass a fallback string so getFileIcon never receives undefined
  const FileIcon = getFileIcon(resource.type ?? "unknown")
  const [isDownloading, setIsDownloading] = useState(false)

  // Safe download handler:
  // 1) If resource.downloadUrl is present, open directly.
  // 2) Else if filePath available, try calling backend API /api/resources/download?filePath=...
  //    backend should return { ok: true, url } or { ok: false, error }.
  // 3) Always guard against null/undefined.
  const handleDownload = async () => {
    const downloadUrl = resource.downloadUrl ?? null
    const filePath = resource.filePath ?? null

    if (downloadUrl) {
      // resource already has a direct URL (signed or public)
      window.open(downloadUrl, "_blank", "noopener,noreferrer")
      return
    }

    if (!filePath) {
      alert("Download not available for this resource.")
      return
    }

    try {
      setIsDownloading(true)
      const res = await fetch(`/api/resources/download?filePath=${encodeURIComponent(filePath)}`)
      const json = await res.json()
      if (!res.ok || !json?.ok) {
        console.error("Download API error:", json)
        alert(json?.error || "Failed to get download link")
        return
      }
      const url = json.url ?? json.signedUrl ?? json.signedURL ?? json.data?.publicUrl ?? null
      if (!url) {
        console.error("Download API returned no URL:", json)
        alert("Download link missing from server response")
        return
      }
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (err) {
      console.error("Download failed:", err)
      alert("Unexpected error while preparing download")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline">{resource.type ?? "Unknown"}</Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{resource.rating ?? 0}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{resource.title ?? "Untitled"}</h2>
            <p className="text-sm text-muted-foreground">{resource.description ?? ""}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0 hover:bg-destructive/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Document Preview Area */}
            <div className="mb-6 rounded-xl border border-muted-foreground/20 bg-white overflow-hidden">
              <MockPreview type={resource.type ?? undefined} />
            </div>

            {/* Resource Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Subject</span>
                    <Badge variant="secondary">{resource.subject ?? "—"}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Semester</span>
                    <Badge variant="secondary">{resource.semester ?? "—"}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Faculty</span>
                    <span className="text-sm font-medium">{resource.faculty ?? "—"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Downloads</span>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{resource.downloads ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Uploaded By</span>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{resource.uploadedBy ?? "Unknown"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(resource.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rating Section */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Rate this resource</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => onRate(star)} className="transition-all hover:scale-125">
                    <Star
                      className={cn(
                        "h-8 w-8",
                        star <= (userRating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                      )}
                    />
                  </button>
                ))}
                {(userRating ?? 0) > 0 && <span className="ml-2 text-sm text-muted-foreground">You rated: {userRating}/5</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 bg-background/95 backdrop-blur-sm border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Preparing..." : "Download Resource"}
          </Button>
        </div>
      </div>
    </div>
  )
}
export default ResourcePreviewModal
