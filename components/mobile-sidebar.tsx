"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { BookOpen, NotebookPen, GraduationCap, LayoutDashboard, Settings, Trello, ChevronDown, GlobeIcon } from "lucide-react"

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
]

const googleLinks = [
  {
    title: "Google Classroom",
    href: "https://classroom.google.com/u/1/",
    icon: GraduationCap,
  },
  {
    title: "Google Docs",
    href: "https://docs.google.com/",
    icon: NotebookPen,
  },
  {
    title: "Google Sheets",
    href: "https://docs.google.com/spreadsheets/",
    icon: BookOpen,
  },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const [isGoogleOpen, setGoogleOpen] = useState(false)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Kazera</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary font-semibold",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
          {/* Dropdown Google */}
          <button
              onClick={() => setGoogleOpen(!isGoogleOpen)}
              className="flex items-center justify-between w-full px-3 py-2 text-muted-foreground hover:text-primary rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <GlobeIcon className="h-4 w-4" />
                <span>Google</span>
              </div>
              <motion.div
                animate={{ rotate: isGoogleOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{ height: isGoogleOpen ? "auto" : 0, opacity: isGoogleOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-4 flex flex-col gap-2">
                {googleLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-primary rounded-xl transition-all"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </Link>
                ))}
              </div>
            </motion.div>
        </nav>
      </div>
    </div>
  )
}

