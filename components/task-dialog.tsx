"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TaskDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  task: Task | null
}

export function TaskDialog({ open, setOpen, task }: TaskDialogProps) {
  const { addTask, updateTask } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [deadline, setDeadline] = useState<Date>(new Date())
  const [link, setLink] = useState("")
  const [errors, setErrors] = useState({
    title: false,
    deadline: false,
  })

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setDeadline(new Date(task.deadline))
      setLink(task.link || "")
    } else {
      resetForm()
    }
  }, [task, open])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("todo")
    setDeadline(new Date())
    setLink("")
    setErrors({ title: false, deadline: false })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      title: title.trim() === "",
      deadline: !deadline,
    }

    setErrors(newErrors)

    if (newErrors.title || newErrors.deadline) {
      return
    }

    const taskData = {
      title,
      description,
      status,
      deadline: deadline.toISOString(),
      link: link.trim() !== "" ? link : undefined,
    }

    if (task) {
      updateTask(task.id, taskData)
    } else {
      addTask(taskData)
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
            <DialogDescription>
              {task ? "Update the details of your assignment." : "Fill in the details for your new assignment."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                Title {errors.title && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-destructive" : ""}
                placeholder="e.g., Math Homework"
              />
              {errors.title && <p className="text-xs text-destructive">Title is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Complete problems 1-10 from Chapter 5"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline" className={errors.deadline ? "text-destructive" : ""}>
                Deadline {errors.deadline && <span className="text-destructive">*</span>}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground",
                      errors.deadline && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={(date) => date && setDeadline(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deadline && <p className="text-xs text-destructive">Deadline is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link">Submission/Reference Link</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g., https://classroom.google.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

