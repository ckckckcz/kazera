import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "./utils"
import type { Task } from "@/lib/types"

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
        try {
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
        } catch (error) {
          console.error("Error adding task:", error)
        }
      },
      deleteTask: (id: string) => {
        try {
          console.log("Deleting task from store:", id)
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }))
        } catch (error) {
          console.error("Error deleting task:", error)
        }
      },
      updateTask: (updatedTask: Task) => {
        try {
          console.log("Updating task in store:", updatedTask)
          set((state) => ({
            tasks: state.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
          }))
        } catch (error) {
          console.error("Error updating task:", error)
        }
      },
      moveTask: (taskId: string, newStatus: string) => {
        try {
          console.log("Moving task in store:", taskId, "to", newStatus)
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task,
            ),
          }))
        } catch (error) {
          console.error("Error moving task:", error)
        }
      },
    }),
    {
      name: "task-store",
      // Fix serialization issues with File objects
      serialize: (state) => {
        // Create a serializable version of the state
        const serializableState = {
          ...state,
          state: {
            ...state.state,
            tasks: state.state.tasks.map((task) => ({
              ...task,
              // Convert File objects to simple objects with name and type
              files:
                task.files?.map((file) => (file instanceof File ? { name: file.name, type: file.type } : file)) || [],
            })),
          },
        }
        return JSON.stringify(serializableState)
      },
    },
  ),
)
