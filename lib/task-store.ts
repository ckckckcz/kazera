import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "./utils"
import type { Task } from "./types"

interface TaskState {
  tasks: Task[]
  addTask: (task: Partial<Task> & { title: string }) => void
  deleteTask: (id: string) => void
  updateTask: (updatedTask: Task) => void
  moveTask: (taskId: string, newStatus: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        console.log("Adding task to store:", task)
        const newTask: Task = {
          id: task.id || generateId(),
          title: task.title,
          description: task.description || "",
          status: (task.status || "todo") as Task["status"],
          deadline: task.deadline || new Date().toISOString().split("T")[0],
          link: task.link,
          files: task.files || [],
          fileUrls: task.fileUrls || [],
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },
      deleteTask: (id: string) => {
        console.log("Deleting task from store:", id)
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },
      updateTask: (updatedTask: Task) => {
        console.log("Updating task in store:", updatedTask)
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        }))
      },
      moveTask: (taskId: string, newStatus: string) => {
        console.log("Moving task in store:", taskId, "to", newStatus)
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task,
          ),
        }))
      },
    }),
    {
      name: "task-store",
    },
  ),
)
