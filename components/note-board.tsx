"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit, FileText, Calendar, Clock, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type Note = {
  id: number
  text: string
  createdAt: string
  deadline?: string
  files?: { name: string; url: string }[]
}

export function NoteBoard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes")
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const handleAddNote = () => {
    setCurrentNote(null)
    setIsDialogOpen(true)
  }

  const handleSaveNote = (text: string, deadline?: string, files?: { name: string; url: string }[]) => {
    if (currentNote) {
      setNotes(notes.map((note) => (note.id === currentNote.id ? { ...note, text, deadline, files } : note)))
    } else {
      const newNote = { id: Date.now(), text, createdAt: new Date().toISOString(), deadline, files }
      setNotes([...notes, newNote])
    }
    setIsDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setCurrentNote(note)
    setIsDialogOpen(true)
  }

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison
    return deadlineDate < today
  }

  return (
    <div className="space-y-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Note Board</h1>
        <Button
          onClick={handleAddNote}
          size="default"
          className="gap-2 rounded-full px-4 shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Catatan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-60 border border-dashed rounded-xl bg-muted/30">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <p className="text-muted-foreground font-medium">Belum ada catatan</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Klik "Tambah Catatan" untuk membuat catatan baru</p>
          </div>
        ) : (
          notes.map((note) => (
            <Card
              key={note.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col border-muted/80 group relative"
            >
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-0.5 shadow-sm">
                  <Button size="icon" variant="ghost" onClick={() => handleEditNote(note)} className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteNote(note.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-5 flex-grow">
                <ScrollArea className="max-h-[180px] pr-4">
                  <p className="prose-sm mb-4 whitespace-pre-wrap">{note.text}</p>

                  {note.files && note.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {note.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline text-sm p-2 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                        >
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              <CardFooter className="px-5 py-4 bg-muted/10 flex flex-col gap-3 border-t border-muted/20">
                <div className="flex justify-between text-xs text-muted-foreground w-full">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{format(new Date(note.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  {note.deadline && (
                    <Badge
                      variant="outline"
                      className={`gap-1.5 font-normal ${
                        isOverdue(note.deadline)
                          ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50"
                          : "bg-background/50"
                      }`}
                    >
                      <Calendar className={`h-3 w-3 ${isOverdue(note.deadline) ? "text-red-500" : ""}`} />
                      <span>{format(new Date(note.deadline), "dd MMM yyyy")}</span>
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <NoteDialog open={isDialogOpen} setOpen={setIsDialogOpen} onSave={handleSaveNote} note={currentNote} />
    </div>
  )
}

function NoteDialog({
  open,
  setOpen,
  onSave,
  note,
}: {
  open: boolean
  setOpen: (state: boolean) => void
  onSave: (text: string, deadline?: string, files?: { name: string; url: string }[]) => void
  note?: Note | null
}) {
  const [text, setText] = useState("")
  const [deadline, setDeadline] = useState("")
  const [files, setFiles] = useState<{ name: string; url: string }[]>([])
  const [previewFile, setPreviewFile] = useState<{ name: string; url: string } | null>(null)

  useEffect(() => {
    if (note) {
      setText(note.text || "")
      setDeadline(note.deadline || "")
      setFiles(note.files || [])
    } else {
      setText("")
      setDeadline("")
      setFiles([])
    }
  }, [note])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handlePreviewFile = (file: { name: string; url: string }) => {
    setPreviewFile(file)
  }

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(text, deadline, files)
      setOpen(false)
    }
  }

  const FilePreviewDialog = () => {
    if (!previewFile) return null

    const fileExtension = previewFile.name.split(".").pop()?.toLowerCase()
    const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExtension || "")
    const isPdf = fileExtension === "pdf"

    return (
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="truncate">{previewFile.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 rounded-md overflow-hidden border bg-muted/20 flex items-center justify-center">
            {isImage ? (
              <div className="relative w-full h-[300px]">
                <img
                  src={previewFile.url || "/placeholder.svg"}
                  alt={previewFile.name}
                  className="object-contain w-full h-full"
                />
              </div>
            ) : isPdf ? (
              <iframe src={previewFile.url} title={previewFile.name} className="w-full h-[400px]" />
            ) : (
              <div className="py-12 px-4 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                <p className="text-muted-foreground">Preview tidak tersedia untuk tipe file ini</p>
                <Button className="mt-4" size="sm" onClick={() => window.open(previewFile.url, "_blank")}>
                  Buka File
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => window.open(previewFile.url, "_blank")} className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download
            </Button>
            <Button onClick={() => setPreviewFile(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{note ? "Edit Catatan" : "Tambah Catatan"}</DialogTitle>
            <DialogDescription>
              {note ? "Perbarui catatan Anda di bawah ini." : "Buat catatan baru untuk disimpan di papan Anda."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="note-text" className="text-sm font-medium">
                Catatan
              </Label>
              <Textarea
                id="note-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis catatan..."
                className="min-h-[120px] resize-y"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline" className="text-sm font-medium">
                Tenggat Waktu (Opsional)
              </Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Lampiran (Opsional)
              </Label>
              <Input id="file-upload" type="file" multiple onChange={handleFileUpload} className="cursor-pointer" />

              {files.length > 0 && (
                <div className="mt-2 space-y-2 border rounded-md p-3 bg-muted/20">
                  <Label className="text-xs text-muted-foreground mb-2 block">{files.length} file terlampir</Label>
                  <div className="max-h-[200px] overflow-y-auto pr-1">
                    {files.map((file, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between text-sm bg-background rounded-md p-2">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreviewFile(file)}
                              className="h-6 w-6 rounded-full hover:bg-primary/10"
                              title="Preview"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-eye"
                              >
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFile(index)}
                              className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                              title="Remove"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <span>Simpan</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FilePreviewDialog />
    </>
  )
}

