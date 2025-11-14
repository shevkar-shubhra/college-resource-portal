"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Upload, FileText, ImageIcon, Video, Archive, X, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "Engineering"]
const semesters = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
]
const faculties = ["Dr. Smith", "Prof. Johnson", "Dr. Davis", "Prof. Wilson", "Dr. Brown", "Prof. Garcia"]

const getFileIcon = (type: string) => {
  if (type.includes("image")) return ImageIcon
  if (type.includes("video")) return Video
  if (type.includes("zip") || type.includes("rar")) return Archive
  return FileText
}

const getFileTypeFromName = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
      return "PDF"
    case "doc":
    case "docx":
      return "DOCX"
    case "ppt":
    case "pptx":
      return "PPT"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "Image"
    case "mp4":
    case "avi":
    case "mov":
      return "Video"
    case "zip":
    case "rar":
      return "Archive"
    default:
      return "File"
  }
}

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [subject, setSubject] = useState("")
  const [semester, setSemester] = useState("")
  const [faculty, setFaculty] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

const handleFiles = (files: FileList) => {
  Array.from(files).forEach((file) => {
    const newFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading", // we set uploading because we will start uploading on submit; change to 'ready' if you prefer
    };

    setUploadedFiles((prev) => [...prev, newFile]);
  });
};


  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  async function uploadSingleFile(u: UploadedFile, meta: {
  title: string;
  description: string;
  subject: string;
  semester: string;
  faculty?: string;
  tags?: string[];
}) {
  return new Promise<{ ok: boolean; json?: any }>((resolve) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (e) {
      if (!e.lengthComputable) return;
      const percent = Math.round((e.loaded / e.total) * 100);
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === u.id ? { ...f, progress: percent } : f))
      );
    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        let json = {};
        try { json = JSON.parse(xhr.responseText); } catch {}
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === u.id ? { ...f, progress: 100, status: "completed" } : f))
        );
        resolve({ ok: true, json });
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === u.id ? { ...f, status: "error" } : f))
        );
        resolve({ ok: false, json: { error: xhr.statusText } });
      }
    };

    xhr.onerror = function () {
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === u.id ? { ...f, status: "error" } : f))
      );
      resolve({ ok: false });
    };

    // Build form data
    const fd = new FormData();
    fd.append("file", u.file);
    fd.append("title", meta.title || u.file.name);
    fd.append("description", meta.description || "");
    fd.append("subject", meta.subject || "");
    fd.append("semester", meta.semester || "");
    if (meta.faculty) fd.append("faculty", meta.faculty);
    if (meta.tags && meta.tags.length) fd.append("tags", JSON.stringify(meta.tags));

    xhr.withCredentials = true; // ✅ Send cookies (important!)
    xhr.open("POST", "/api/upload");
    xhr.send(fd);
  });
}


  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags((prev) => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title || !description || !subject || !semester || uploadedFiles.length === 0) {
    alert("Please fill required fields and add at least one file.");
    return;
  }

  // Upload files sequentially (keeps load small) — you can make parallel if you want.
  for (const u of uploadedFiles) {
    // skip files already uploaded successfully
    if (u.status === "completed") continue;

    // call upload helper with metadata
    const res = await uploadSingleFile(u, {
      title,
      description,
      subject,
      semester,
      faculty,
      tags,
    });

    if (!res.ok) {
      alert(`Upload failed for ${u.file.name}. See console for details.`);
      console.error("Upload failed for", u.file.name, res.json);
      // decide whether to stop further uploads or continue; here we continue
    } else {
      console.log("Upload success:", res.json);
      // optionally collect returned resource IDs & redirect later
    }
  }

  alert("All uploads attempted. Check status icons.");
  // Optionally: redirect user to /my-space or resource list
  // window.location.href = "/my-space";
};


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Header />

        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-serif mb-2">Upload Resource</h1>
              <p className="text-muted-foreground">Share your study materials with the community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Upload Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>Upload your study materials (PDF, DOCX, PPT, images, videos, etc.)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Drag and drop your files here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                    <Button type="button" variant="outline">
                      Choose Files
                    </Button>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="font-semibold">Uploaded Files</h4>
                      {uploadedFiles.map((uploadedFile) => {
                        const FileIcon = getFileIcon(uploadedFile.file.type)
                        const fileType = getFileTypeFromName(uploadedFile.file.name)

                        return (
                          <div key={uploadedFile.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileIcon className="h-5 w-5 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{uploadedFile.file.name}</p>
                                <Badge variant="outline">{fileType}</Badge>
                                {uploadedFile.status === "completed" && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {uploadedFile.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              {uploadedFile.status === "uploading" && (
                                <Progress value={uploadedFile.progress} className="mt-2 h-2" />
                              )}
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(uploadedFile.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resource Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Resource Details</CardTitle>
                  <CardDescription>Provide information about your resource to help others find it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Advanced Calculus Complete Notes"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this resource contains and how it can help other students..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={subject} onValueChange={setSubject} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subj) => (
                            <SelectItem key={subj} value={subj}>
                              {subj}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="semester">Semester *</Label>
                      <Select value={semester} onValueChange={setSemester} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((sem) => (
                            <SelectItem key={sem} value={sem}>
                              {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="faculty">Faculty</Label>
                      <Select value={faculty} onValueChange={setFaculty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((fac) => (
                            <SelectItem key={fac} value={fac}>
                              {fac}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add tags to help others find your resource"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90"
                  disabled={!title || !description || !subject || !semester || uploadedFiles.length === 0}
                >
                  Upload Resource
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
