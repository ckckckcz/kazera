"use client"

import { useState } from "react"
import { File, FileText, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface FilePreviewProps {
  file: File | { name: string; type: string }
  url: string
  onRemove?: () => void
  showRemoveButton?: boolean
}

export function FilePreview({ file, url, onRemove, showRemoveButton = true }: FilePreviewProps) {
  const [previewOpen, setPreviewOpen] = useState(false)

  // Safely access file properties
  const fileName = file ? file.name || "Unknown file" : "Unknown file"
  const fileType = file && "type" in file ? file.type : ""

  const getFileIcon = () => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    if (extension === "pdf") {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (["doc", "docx"].includes(extension)) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else if (["xls", "xlsx"].includes(extension)) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <ImageIcon className="h-5 w-5 text-purple-500" />
    } else {
      return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const renderPreviewContent = () => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <img src={url || "/placeholder.svg"} alt={fileName} className="max-h-[80vh] max-w-full object-contain" />
    } else if (extension === "pdf") {
      return <iframe src={`${url}#toolbar=0`} className="w-full h-[80vh]" title={fileName} />
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          {getFileIcon()}
          <p className="mt-4 text-center">
            Preview not available for this file type.
            <a href={url} download={fileName} className="block mt-2 text-primary hover:underline">
              Download file
            </a>
          </p>
        </div>
      )
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
        {getFileIcon()}
        <span className="truncate max-w-[120px]" title={fileName}>
          {fileName}
        </span>
        <div className="flex ml-auto">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPreviewOpen(true)}>
            <FileText className="h-4 w-4" />
            <span className="sr-only">Preview</span>
          </Button>
          {showRemoveButton && onRemove && (
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onRemove}>
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium truncate">{fileName}</h3>
            <a href={url} download={fileName} className="text-sm text-primary hover:underline">
              Download
            </a>
          </div>
          {renderPreviewContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}
