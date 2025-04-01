"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit, FileText, Calendar, Clock } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

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

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Note Board</h1>
        <Button onClick={handleAddNote} size="default" className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Tambah Catatan</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-60 border border-dashed rounded-xl bg-muted/30">
            <p className="text-muted-foreground">Belum ada catatan</p>
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
              <CardContent className="p-5 flex-grow">
                <p className="prose-sm mb-4">{note.text}</p>

                {note.files && note.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {note.files.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-5 py-4 bg-muted/20 flex flex-col gap-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{format(new Date(note.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  {note.deadline && (
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(note.deadline), "dd MMM yyyy")}</span>
                    </Badge>
                  )}
                </div>
                <Separator />

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditNote(note)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(note.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(text, deadline, files)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit Catatan" : "Tambah Catatan"}</DialogTitle>
        </DialogHeader>

        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis catatan..." />
        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <Input type="file" multiple onChange={handleFileUpload} />
        {files.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}

        <DialogFooter>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
