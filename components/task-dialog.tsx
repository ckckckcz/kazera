"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FileUpload } from "@/components/file-upload"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"

// Define a more flexible schema for files
const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().default(""),
  status: z.enum(["todo", "in-progress", "done"]),
  deadline: z.string(),
  link: z.string().optional(),
  files: z.any().optional(),
  fileUrls: z.array(z.string()).optional(),
})

type FormTask = z.infer<typeof taskSchema>

interface TaskDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  task?: Task | null
  onSave?: (task: Task) => void
  onDelete?: (id: string) => void
}

export function TaskDialog({ open, setOpen, task, onSave, onDelete }: TaskDialogProps) {
  const [files, setFiles] = useState<File[]>([])
  const [fileUrls, setFileUrls] = useState<string[]>([])

  // Create a default form state
  const defaultFormValues = {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    status: "todo" as const,
    deadline: new Date().toISOString().split("T")[0],
    link: "",
  }

  const form = useForm<FormTask>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  })

  // Reset form when dialog opens/closes or task changes
  useEffect(() => {
    try {
      if (open) {
        if (task) {
          // Edit existing task
          form.reset({
            id: task.id || crypto.randomUUID(),
            title: task.title || "",
            description: task.description || "",
            status: task.status || "todo",
            deadline: task.deadline || new Date().toISOString().split("T")[0],
            link: task.link || "",
          })

          // Handle files separately to avoid serialization issues
          setFiles(task.files || [])
          setFileUrls(task.fileUrls || [])
        } else {
          // Create new task
          form.reset(defaultFormValues)
          setFiles([])
          setFileUrls([])
        }
      }
    } catch (error) {
      console.error("Error resetting form:", error)
      // Fallback to default values
      form.reset(defaultFormValues)
      setFiles([])
      setFileUrls([])
    }
  }, [task, form, open])

  function onSubmit(values: FormTask) {
    try {
      // Combine form values with file data
      const taskData: Task = {
        ...values,
        files: files || [],
        fileUrls: fileUrls || [],
        description: values.description || "",
      }

      console.log("Submitting task:", taskData)

      if (onSave) {
        onSave(taskData)
      } else {
        // Fallback implementation using the task store directly
        const { addTask, updateTask } = useTaskStore.getState()
        if (taskData.id && task?.id) {
          updateTask(taskData)
        } else {
          addTask(taskData)
        }
      }
      setOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  // Handle file upload changes
  const handleFileChange = (newFiles: File[], newUrls: string[]) => {
    try {
      setFiles(newFiles)
      setFileUrls(newUrls)
    } catch (error) {
      console.error("Error handling file change:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{task ? "Edit Task" : "Create Task"}</AlertDialogTitle>
          <AlertDialogDescription>
            {task
              ? "Edit your task here. Click save when you're done."
              : "Create a new task here. Click save when you're done."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task Description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString().split("T")[0] || "")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Link" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2 mb-4">
              <Label htmlFor="files">Attachments</Label>
              <FileUpload files={files} fileUrls={fileUrls} onChange={handleFileChange} />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {task && onDelete ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your task from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (task?.id) {
                            onDelete(task.id)
                            setOpen(false)
                          }
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
              <Button type="submit">Save</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
