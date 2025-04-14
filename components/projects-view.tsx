"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website with new branding",
    status: "In Progress",
    progress: 65,
    members: [
      { name: "Alex Johnson", image: "/placeholder-user.jpg", initials: "AJ" },
      { name: "Sarah Miller", image: "/placeholder-user.jpg", initials: "SM" },
      { name: "David Chen", image: "/placeholder-user.jpg", initials: "DC" },
    ],
    dueDate: "Mar 15, 2025",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Create a new mobile app for iOS and Android",
    status: "Planning",
    progress: 25,
    members: [
      { name: "Emily Wilson", image: "/placeholder-user.jpg", initials: "EW" },
      { name: "Michael Brown", image: "/placeholder-user.jpg", initials: "MB" },
    ],
    dueDate: "Jun 30, 2025",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q2 marketing campaign for new product launch",
    status: "Completed",
    progress: 100,
    members: [
      { name: "Jessica Lee", image: "/placeholder-user.jpg", initials: "JL" },
      { name: "Robert Taylor", image: "/placeholder-user.jpg", initials: "RT" },
      { name: "Amanda Garcia", image: "/placeholder-user.jpg", initials: "AG" },
    ],
    dueDate: "Feb 28, 2025",
  },
]

export function ProjectsView() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectCard({ project }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit project</DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
          <span className="text-sm text-muted-foreground">Due {project.dueDate}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, i) => (
              <Avatar key={i} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

