"use client"

import * as React from "react"
import { cn } from "@utils/cn"

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

const Dialog = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return <DialogContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>{children}</DialogContext.Provider>
}

const DialogTrigger = ({
  children,
  asChild,
  ...props
}: {
  children: React.ReactNode
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within Dialog")

  const handleClick = () => {
    context.onOpenChange(true)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: handleClick,
    })
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within Dialog")

    const { open, onOpenChange } = context

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false)
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [open, onOpenChange])

    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />

        {/* Content */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg sm:rounded-lg",
            className,
          )}
          {...props}
        >
          {children}
          {/* Close button */}
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => onOpenChange(false)}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    )
  },
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle }
