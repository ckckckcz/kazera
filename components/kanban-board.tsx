"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ExternalLink, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskDialog } from "@/components/task-dialog"
import { useTaskStore } from "@/lib/task-store"
import type { Task } from "@/lib/types"

const columnsData = [
  { id: "todo", title: "To Do", color: "bg-muted" },
  { id: "in-progress", title: "In Progress", color: "bg-muted" },
  { id: "done", title: "Done", color: "bg-muted" },
]

export function KanbanBoard() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  const { tasks, moveTask, deleteTask } = useTaskStore()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // If there's no destination or if the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    moveTask(draggableId, destination.droppableId)
  }

  const handleAddTask = () => {
    setCurrentTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
  }

  const getColumnTasks = (columnId: string) => {
    return tasks.filter((task) => task.status === columnId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (deadline: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    return deadlineDate < today
  }

  return (
    <div className={`space-y-6 ${isVisible ? "animate-in" : "opacity-0"}`}>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Board</h1>
          <p className="text-muted-foreground">Manage your school assignments with drag and drop</p>
        </div>
        <Button onClick={handleAddTask} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columnsData.map((column) => (
            <div
              key={column.id}
              className={`${isVisible ? "slide-in" : "opacity-0"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className={`rounded-xl  ${column.color} px-4 py-2 font-medium`}>
                <div className="flex items-center justify-between">
                  <h3>{column.title}</h3>
                  <Badge variant="outline">{getColumnTasks(column.id).length}</Badge>
                </div>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="mt-5 space-y-3 kanban-column"
                  >
                    {getColumnTasks(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${snapshot.isDragging ? "is-dragging" : ""}`}
                          >
                            <Card className="shadow-sm">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <p className="text-sm text-muted-foreground mt-2 mb-3">{task.description}</p>

                                <div className="flex items-center text-sm text-muted-foreground mt-4">
                                  <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                  <span
                                    className={
                                      isOverdue(task.deadline) && task.status !== "done" ? "text-destructive" : ""
                                    }
                                  >
                                    {formatDate(task.deadline)}
                                  </span>
                                </div>

                                {task.link && (
                                  <div className="mt-3">
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                      <a href={task.link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                        Open Link
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {getColumnTasks(column.id).length === 0 && (
                      <div className="flex items-center justify-center h-24 border border-dashed rounded-xl">
                        <p className="text-sm text-muted-foreground">No assignments</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog open={isDialogOpen} setOpen={setIsDialogOpen} task={currentTask} />
    </div>
  )
}

