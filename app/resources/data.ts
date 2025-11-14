// app/resources/data.ts (add or replace export type Resource ...)
export type ResourceVersion = {
  id: string
  fileName?: string | null
  filePath?: string | null
  mimeType?: string | null
  size?: number | null
  version?: number | null
  createdAt?: string | Date | null
}

export type Resource = {
  id: string
  title: string
  description?: string | null
  subject?: string | null
  semester?: string | null
  faculty?: string | null
  type?: string | null
  size?: string | number | null
  downloads?: number | null
  rating?: number | null
  uploadedBy?: string | null
  timeAgo?: string | null
  tags?: string[] | null
  // file fields coming from API
  fileName?: string | null
  filePath?: string | null
  downloadUrl?: string | null
  version?: ResourceVersion | null
  uploader?: { id: string; name?: string | null; email?: string | null; image?: string | null } | null
  createdAt?: string | Date
  updatedAt?: string | Date
}
