import React from "react"
import { cn } from "@utils/cn"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
      destructive: "bg-red-600 hover:bg-red-700 text-white",
      outline: "text-gray-900 border border-gray-300",
    }

    const finalClassName = className || variants[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          finalClassName
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"
