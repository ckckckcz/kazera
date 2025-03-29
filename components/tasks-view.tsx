"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new landing page",
    status: "In Progress",
    priority: "High",
    dueDate: "Mar 10, 2025",
    assignee: { name: "Sarah Miller", image: "/placeholder-user.jpg", initials: "SM" },
    completed: false,
  },
  {
    id: 2,
    title: "Implement authentication",
    description: "Add user authentication to the application",
    status: "To Do",
    priority: "Medium",
    dueDate: "Mar 15, 2025",
    assignee: { name: "David Chen", image: "/placeholder-user.jpg", initials: "DC" },
    completed: false,
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all API endpoints for the developer portal",
    status: "In Progress",
    priority: "Low",
    dueDate: "Mar 12, 2025",
    assignee: { name: "Alex Johnson", image: "/placeholder-user.jpg", initials: "AJ" },
    completed: false,
  },
  {
    id: 4,
    title: "Fix navigation bug",
    description: "Fix the navigation bug on mobile devices",
    status: "Done",
    priority: "High",
    dueDate: "Mar 5, 2025",
    assignee: { name: "Emily Wilson", image: "/placeholder-user.jpg", initials: "EW" },
    completed: true,
  },
  {
    id: 5,
    title: "Create content for blog",
    description: "Write 3 blog posts for the company blog",
    status: "To Do",
    priority: "Medium",
    dueDate: "Mar 20, 2025",
    assignee: { name: "Jessica Lee", image: "/placeholder-user.jpg", initials: "JL" },
    completed: false,
  },
]

export function TasksView() {
  const [userTasks, setUserTasks] = useState(tasks)

  const toggleTaskCompletion = (taskId) => {
    setUserTasks(userTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-0">
        <div className="divide-y">
          {userTasks.map((task) => (
            <div key={task.id} className={`py-4 transition-opacity ${task.completed ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-4">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`font-medium ${task.completed ? "line-through" : ""}`}
                    >
                      {task.title}
                    </label>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {task.dueDate}
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.image} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

