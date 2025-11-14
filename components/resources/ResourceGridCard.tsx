"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Eye, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Resource } from "@/app/resources/data";
import { getFileIcon } from "@/app/resources/utils";

type ResourceGridCardProps = {
  resource: Resource;
  userRating: number;
  onRate: (rating: number) => void;
  onPreview: () => void;
};

// simple in-memory cache for signed/public urls so repeated clicks don't re-request
const downloadCache = new Map<number, string>();

export function ResourceGridCard({
  resource,
  userRating,
  onRate,
  onPreview,
}: ResourceGridCardProps) {
  const FileIcon = getFileIcon(resource.type ?? "");

// snippet for both ResourceGridCard and ResourceListCard
// put this inside the component, near other handlers
// utils: safe filename builder
function safeFileName(name?: string) {
  if (!name) return "resource";
  return name.replace(/[/\\?%*:|"<>]/g, "_");
}

// in ResourceGridCard / ResourceListCard
const handleDownload = async (resource: Resource) => {
  console.log("download clicked for", resource);
  const url = resource.downloadUrl;
  if (!url) {
    alert("Download not available right now.");
    return;
  }

  try {
    // Optional: show some UI loading state here
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Download failed: ${resp.status} ${resp.statusText}`);
    }

    const blob = await resp.blob();
    // Derive filename: prefer version.fileName then resource.title
    const filename = safeFileName(resource.version?.fileName ?? resource.title ?? "resource");

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    // append to DOM to make click work on all browsers
    document.body.appendChild(a);
    a.click();
    a.remove();
    // cleanup
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download file. Check console for details.");
  } finally {
    // hide loading state
  }
};





  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {/* FileIcon is a component returned by getFileIcon */}
              <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="outline">{resource.type}</Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {resource.rating ?? "-"}
          </div>
        </div>

        <h3 className="font-semibold mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {resource.description ?? ""}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{resource.subject}</Badge>
            <Badge variant="secondary">{resource.semester}</Badge>
          </div>
          <div className="flex flex-wrap gap-1">
            {(resource.tags ?? []).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-sm text-muted-foreground mr-2">Rate:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => onRate(star)} className="transition-colors hover:scale-110">
              <Star
                className={cn(
                  "h-4 w-4",
                  star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {resource.downloads ?? 0}
          </div>
          <span>{resource.size ?? ""}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{resource.uploadedBy}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onPreview}>
              <Eye className="h-4 w-4" />
            </Button>
            {/* Primary download button (calls handler) */}
<Button
  variant="outline"
  onClick={() => handleDownload(resource)}
>
  Download
</Button>

{/* Visible fallback link for debugging / manual download (shows only when url exists) */}
{resource.downloadUrl ? (
  <a href={`/api/resources/download?id=${encodeURIComponent(resource.id)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs underline">
  Open in new tab
</a>
) : null}

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
