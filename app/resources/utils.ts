import { FileText, Video, Archive } from "lucide-react"

export const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF":
    case "DOCX":
      return FileText
    case "PPT":
      return FileText
    case "MP4":
      return Video
    case "ZIP":
      return Archive
    default:
      return FileText
  }
}