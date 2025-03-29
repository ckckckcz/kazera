"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">Kazera</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">Kazera Platform</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        All-in-one project management solution for teams of all sizes
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/products/tasks" title="Tasks">
                  Manage and track tasks with customizable workflows
                </ListItem>
                <ListItem href="/products/docs" title="Documents">
                  Create and collaborate on rich documents
                </ListItem>
                <ListItem href="/products/analytics" title="Analytics">
                  Get insights into your team's performance
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/solutions/project-management" title="Project Management">
                  Plan, track, and manage projects with ease
                </ListItem>
                <ListItem href="/solutions/team-collaboration" title="Team Collaboration">
                  Work together seamlessly across departments
                </ListItem>
                <ListItem href="/solutions/product-development" title="Product Development">
                  Streamline your product development lifecycle
                </ListItem>
                <ListItem href="/solutions/marketing" title="Marketing">
                  Manage campaigns and track performance
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/resources/blog" title="Blog">
                  Latest news, tips, and best practices
                </ListItem>
                <ListItem href="/resources/guides" title="Guides">
                  Step-by-step guides to get the most out of Kazera
                </ListItem>
                <ListItem href="/resources/templates" title="Templates">
                  Ready-to-use templates for various workflows
                </ListItem>
                <ListItem href="/resources/webinars" title="Webinars">
                  Live and recorded sessions with experts
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/pricing" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="ml-auto flex items-center">
        <ModeToggle />
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

