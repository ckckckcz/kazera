"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, AlertCircle, ArrowRight, Github, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { dummyUsers } from "@/lib/data/dummy"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check dummy users
      const user = dummyUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Simpan data pengguna ke localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };  

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
        <div className="container relative z-10 mx-auto flex min-h-screen items-center justify-center px-4">
            <motion.div initial="hidden" animate="visible" variants={formVariants} className="w-full max-w-md">
                <Card className="overflow-hidden border shadow-xl bg-black">
                    <CardHeader className="space-y-1 pb-6 pt-8">
                    <motion.div variants={itemVariants}>
                        <CardTitle className="text-center text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
                    </motion.div>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence>
                        {error && (
                            <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            >
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            </motion.div>
                        )}
                        </AnimatePresence>

                        <motion.div className="space-y-2" variants={itemVariants}>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <div className="relative">
                            <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-11 px-4 py-3 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white bg-black"
                            />
                        </div>
                        </motion.div>

                        <motion.div className="space-y-2" variants={itemVariants}>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium">
                            Password
                            </Label>
                        </div>
                        <div className="relative">
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-11 px-4 py-3 pr-10 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white bg-black"
                            />
                            <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-11 w-11 rounded-l-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                        </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Remember me
                        </label>
                        </motion.div>

                        <motion.div variants={itemVariants} initial="rest" whileHover="hover" whileTap="tap" className="pt-2">
                        <Button
                            type="submit"
                            className="group relative h-11 w-full overflow-hidden bg-white text-black transition-all duration-300"
                            disabled={isLoading}
                            variants={buttonVariants}
                        >
                            {isLoading ? (
                            <>
                                <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                                />
                                <span>Tunggu Sebentar...</span>
                            </>
                            ) : (
                            <>
                                <span>Masuk</span>
                            </>
                            )}

                            {/* Animated button background effect */}
                            <motion.div
                            className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/20 to-blue-500/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </Button>
                        </motion.div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className=" px-2 text-gray-500 bg-gray-950 ">
                            Or continue with
                            </span>
                        </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                        <motion.div className="flex-1" variants={itemVariants} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                            <Button variant="outline" className="h-11 w-full bg-black rounded-lg">
                            <Github className="mr-2 h-4 w-4" />
                              Github
                            </Button>
                        </motion.div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </motion.div>
        </div>
    </div>
  )
}
