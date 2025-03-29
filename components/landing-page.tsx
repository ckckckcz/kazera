"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className={`container px-4 md:px-6 space-y-10 ${isVisible ? "animate-in" : "opacity-0"}`}>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Made for work,
                  <br />
                  designed to love
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Streamline workflows, gain clear visibility across teams, and empower smarter decisions with AI
                  seamlessly woven into your work.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">No credit card needed • Unlimited time on Free plan</div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className={`space-y-4 ${isVisible ? "slide-in" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Powerful Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need in one place</h2>
                <p className="text-muted-foreground md:text-lg">
                  Kazera combines the best of Monday.com and Notion to create a seamless project management experience.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Customizable workflows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Rich document editing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Task management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>AI-powered insights</span>
                  </li>
                </ul>
              </div>
              <div
                className={`rounded-xl border bg-muted/50 p-2 ${isVisible ? "slide-in" : "opacity-0"}`}
                style={{ animationDelay: "0.4s" }}
              >
                <div className="overflow-hidden rounded-lg border bg-background">
                  <div className="bg-muted p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Project planning</div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div className="font-medium">Task</div>
                          <div className="font-medium">Status</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <div>Research</div>
                          </div>
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Complete</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <div>Design</div>
                          </div>
                          <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                            In Progress
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <div>Development</div>
                          </div>
                          <div className="rounded-full bg-muted px-2 py-1 text-xs">Not Started</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div
            className={`container px-4 md:px-6 ${isVisible ? "animate-in" : "opacity-0"}`}
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Get Started Today</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to transform your workflow?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of teams already using Kazera to streamline their work.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">No credit card required to start your free trial.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kazera. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

