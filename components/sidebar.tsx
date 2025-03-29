"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, NotebookPen, GraduationCap, LayoutDashboard, Settings, Trello } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    target: "",
  },
  {
    title: "Kanban Board",
    href: "/dashboard/kanban",
    icon: Trello,
    target: "",
  },
  {
    title: "Note",
    href: "/dashboard/note",
    icon: NotebookPen,
    target: "",
  },
  {
    title: "LMS Polinema",
    href: "https://lmsslc.polinema.ac.id/my/",
    icon: BookOpen,
    target: "_blank",
  },
  {
    title: "Google Classroom",
    href: "https://classroom.google.com/u/1/",
    icon: GraduationCap,
    target: "_blank",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full min-h-screen flex-col gap-2">
        <div className="flex-1 py-4">
          <nav className="grid items-start px-4 text-md font-medium gap-3">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary font-semibold",
                )}
                target={item.target}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

