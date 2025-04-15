"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilePreview } from "@/components/file-preview"

interface FileUploadProps {
  files: (File | { name: string; type: string })[]
  fileUrls: string[]
  onChange: (files: File[], urls: string[]) => void
  maxFiles?: number
}

export function FileUpload({ files = [], fileUrls = [], onChange, maxFiles = 10 }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const totalFiles = [...(files.filter((f) => f instanceof File) as File[]), ...newFiles]

      if (totalFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`)
        return
      }

      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      onChange([...totalFiles], [...fileUrls, ...newUrls])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      const totalFiles = [...(files.filter((f) => f instanceof File) as File[]), ...newFiles]

      if (totalFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`)
        return
      }

      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      onChange([...totalFiles], [...fileUrls, ...newUrls])
    }
  }

  const removeFile = (index: number) => {
    try {
      const newFiles = [...files]
      const newUrls = [...fileUrls]

      // Revoke the object URL to avoid memory leaks
      if (newUrls[index]) {
        URL.revokeObjectURL(newUrls[index])
      }

      newFiles.splice(index, 1)
      newUrls.splice(index, 1)

      onChange(newFiles.filter((f) => f instanceof File) as File[], newUrls)
    } catch (error) {
      console.error("Error removing file:", error)
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">Drag and drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground">Supported formats: PDF, Word, Excel, and images</p>
      </div>

      {files && files.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-3">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              url={fileUrls && index < fileUrls.length ? fileUrls[index] : ""}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
