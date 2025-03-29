"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, CheckCircle, Clock, Trello } from "lucide-react"
import Link from "next/link"
import { useTaskStore } from "@/lib/task-store"
import { Progress } from "@/components/ui/progress"

export function Dashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const { tasks } = useTaskStore()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Find upcoming deadlines (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingDeadlines = tasks
    .filter((task) => {
      const deadlineDate = new Date(task.deadline)
      return deadlineDate >= today && deadlineDate <= nextWeek && task.status !== "done"
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)

  return (
    <div className={`space-y-6 ${isVisible ? "animate-in" : "opacity-0"}`}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your assignments.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <div className="mt-2">
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{completionPercentage}% complete</p>
          </CardContent>
        </Card>

        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {todoTasks > 0 ? "Assignments waiting to be started" : "No pending assignments"}
            </p>
          </CardContent>
        </Card>

        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Trello className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {inProgressTasks > 0 ? "Assignments currently in progress" : "No assignments in progress"}
            </p>
          </CardContent>
        </Card>

        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.4s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks > 0 ? "Assignments completed" : "No completed assignments yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(task.deadline) <= new Date()
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {new Date(task.deadline) <= new Date() ? "Due Today" : "Upcoming"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No upcoming deadlines for the next 7 days</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button asChild>
                <Link href="/dashboard/kanban">
                  Go to Kanban Board <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/courses">
                  View Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/schedule">
                  Check Schedule <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

