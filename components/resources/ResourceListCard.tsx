"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Eye, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Resource } from "@/app/resources/data";
import { getFileIcon } from "@/app/resources/utils";

type ResourceListCardProps = {
  resource: Resource;
  userRating: number;
  onRate: (rating: number) => void;
  onPreview: () => void;
};

// reuse same cache as grid card (module-scoped)
const downloadCache = new Map<number, string>();

export function ResourceListCard({ resource, userRating, onRate, onPreview }: ResourceListCardProps) {
  const FileIcon = getFileIcon(resource.type ?? "");

// snippet for both ResourceGridCard and ResourceListCard
// put this inside the component, near other handlers
const handleDownload = (resource: any) => {
  console.log("download clicked for", resource);

  if (resource.downloadUrl) {
    const link = document.createElement("a");
    link.href = resource.downloadUrl;
    link.download = resource.title || "resource"; // suggest file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error("No download URL found for resource", resource);
  }
};




  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileIcon className="h-6 w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{resource.title}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {resource.rating ?? "-"}
                </div>
                <Badge variant="outline">{resource.type}</Badge>
              </div>
            </div>

            <p className="text-muted-foreground mb-3">{resource.description ?? ""}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{resource.subject}</Badge>
              <Badge variant="secondary">{resource.semester}</Badge>
              <Badge variant="secondary">{resource.faculty}</Badge>
              {(resource.tags ?? []).slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-1 mb-3">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {resource.downloads ?? 0} downloads
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {resource.uploadedBy}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {resource.timeAgo}
                </div>
                <span>{resource.size ?? ""}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={onPreview}>
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                {/* Primary download button (calls handler) */}
<Button size="sm" onClick={handleDownload}>
  <Download className="h-4 w-4" />
</Button>

{/* Visible fallback link for debugging / manual download (shows only when url exists) */}
{resource.downloadUrl ? (
  <a href={`/api/resources/download?id=${encodeURIComponent(resource.id)}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs underline">
  Open in new tab
</a>
) : null}

              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
