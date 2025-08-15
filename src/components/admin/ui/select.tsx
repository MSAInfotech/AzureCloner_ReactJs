"use client"

import * as React from "react"
import { cn } from "@utils/cn"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, disabled, children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <SelectContext.Provider value={{ value, onValueChange, disabled, isOpen, setIsOpen }}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)

    if (!context) {
      throw new Error("SelectTrigger must be used within a Select")
    }

    const { disabled, isOpen, setIsOpen } = context

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <svg
          className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

interface SelectValueProps {
  placeholder?: string
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error("SelectValue must be used within a Select")
  }

  return <span>{context.value || placeholder}</span>
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

const SelectContent: React.FC<SelectContentProps> = ({ className, children }) => {
  const context = React.useContext(SelectContext)
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })
  const contentRef = React.useRef<HTMLDivElement>(null)

  if (!context) {
    throw new Error("SelectContent must be used within a Select")
  }

  const { isOpen } = context

  React.useEffect(() => {
    if (isOpen) {
      const selectElement = contentRef.current?.parentElement?.querySelector("button")
      if (selectElement) {
        const rect = selectElement.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const dropdownHeight = 200 // Approximate dropdown height

        let top = rect.bottom + window.scrollY

        // Check if dropdown would go below viewport on mobile
        if (rect.bottom + dropdownHeight > viewportHeight) {
          top = rect.top + window.scrollY - dropdownHeight
        }

        setPosition({
          top,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-[9998]" style={{ backgroundColor: "transparent" }} />
      <div
        ref={contentRef}
        className={cn(
          "fixed z-[9999] min-w-[8rem] max-h-60 overflow-auto rounded-md border bg-white dark:bg-gray-800 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          "sm:text-sm",
          className,
        )}
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
          zIndex: 9999,
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {children}
      </div>
    </>
  )
}

interface SelectItemProps {
  value: string
  className?: string
  children: React.ReactNode
}

const SelectItem: React.FC<SelectItemProps> = ({ value, className, children }) => {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error("SelectItem must be used within a Select")
  }

  const { value: selectedValue, onValueChange, setIsOpen } = context

  const handleClick = () => {
    onValueChange(value)
    setIsOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600",
        "min-h-[40px] sm:min-h-[32px]",
        className,
      )}
    >
      {selectedValue === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {children}
    </div>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
