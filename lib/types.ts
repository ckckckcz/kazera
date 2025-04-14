export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  deadline: string
  link?: string
  files?: File[]
  fileUrls?: string[]
}
