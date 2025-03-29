"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task } from "./types"
import { v4 as uuidv4 } from "uuid"

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, task: Partial<Omit<Task, "id">>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: string) => void
}

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Math Assignment",
    description: "Complete problems 1-20 from Chapter 3",
    status: "todo",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    link: "https://classroom.google.com/math",
  },
  {
    id: "task-2",
    title: "History Essay",
    description: "Write a 1000-word essay on World War II",
    status: "in-progress",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    link: "https://classroom.google.com/history",
  },
  {
    id: "task-3",
    title: "Science Lab Report",
    description: "Complete the lab report for the chemistry experiment",
    status: "done",
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    link: "https://classroom.google.com/science",
  },
]

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: initialTasks,

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: uuidv4() }],
        })),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)),
        })),
    }),
    {
      name: "kazera-tasks",
    },
  ),
)

