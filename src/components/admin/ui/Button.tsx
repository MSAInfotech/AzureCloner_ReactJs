import * as React from "react"
import { cn } from "@utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm dark:bg-purple-700 dark:hover:bg-purple-800",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm dark:bg-red-700 dark:hover:bg-red-800",
      outline:
        "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 dark:hover:text-white",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
      ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
      link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-11 rounded-lg px-8",
      icon: "h-10 w-10",
    }

    return <button className={cn(baseStyles, variants[variant], sizes[size], className)} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }
