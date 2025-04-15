"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, CheckCircle, Clock, Trello } from "lucide-react"
import Link from "next/link"
import { useTaskStore } from "@/lib/task-store"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/context/UserContext"

export function Dashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const { tasks } = useTaskStore()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

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

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/70" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight">Total Assignments</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{totalTasks}</div>
            <div className="mt-3 space-y-2">
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{completionPercentage}% complete</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/70" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight">To Do</CardTitle>
            <div className="rounded-full bg-amber-500/10 p-2">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{todoTasks}</div>
            <p className="mt-3 text-xs text-muted-foreground">
              {todoTasks > 0 ? "Assignments waiting to be started" : "No pending assignments"}
            </p>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500/70" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight">In Progress</CardTitle>
            <div className="rounded-full bg-violet-500/10 p-2">
              <Trello className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{inProgressTasks}</div>
            <p className="mt-3 text-xs text-muted-foreground">
              {inProgressTasks > 0 ? "Assignments currently in progress" : "No assignments in progress"}
            </p>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden transition-all duration-300 hover:shadow-md"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500/70" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight">Completed</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{completedTasks}</div>
            <p className="mt-3 text-xs text-muted-foreground">
              {completedTasks > 0 ? "Assignments completed" : "No completed assignments yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
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
      </div>
    </div>
  )
}

