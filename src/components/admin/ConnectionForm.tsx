"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/utils/cn"
import { azureService } from "@services/azureService"

const useStore = () => ({
  showToast: (message: string, type: "success" | "error") => {
    console.log(`${type.toUpperCase()}: ${message}`)
  },
})

interface AzureConnection {
  id?: string
  status?: string
  lastValidated?: string
  name: string
  subscriptionId: string
  tenantId: string
  clientId: string
  clientSecret: string
  environment: string
  latestSessionId: string
}

interface ConnectionFormProps {
  onSubmit: (connection: Omit<AzureConnection, "id" | "status" | "lastValidated">) => void
  onCancel: () => void
}

interface FormData {
  name: string
  subscriptionId: string
  tenantId: string
  clientId: string
  clientSecret: string
  environment: string
  latestSessionId: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const ConnectionForm: React.FC<ConnectionFormProps> = ({ onSubmit, onCancel }) => {
  const [showSecret, setShowSecret] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    subscriptionId: "",
    tenantId: "",
    clientId: "",
    clientSecret: "",
    environment: "Development",
    latestSessionId: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { showToast } = useStore()

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Connection name is required"
        if (value.length < 3) return "Connection name must be at least 3 characters"
        return undefined

      case "tenantId":
        if (!value.trim()) return "Tenant ID is required"
        return undefined

      case "subscriptionId":
        if (!value.trim()) return "Subscription ID is required"
        return undefined

      case "clientId":
        if (!value.trim()) return "Client ID is required"
        return undefined

      case "clientSecret":
        if (!value.trim()) return "Client secret is required"
        return undefined

      case "environment":
        if (!value) return "Environment type is required"
        return undefined

      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    const fieldsToValidate: (keyof FormData)[] = [
      "name",
      "tenantId",
      "subscriptionId",
      "clientId",
      "clientSecret",
      "environment",
    ]

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const allTouched = Object.keys(formData).reduce(
        (acc, key) => {
          acc[key] = true
          return acc
        },
        {} as Record<string, boolean>,
      )
      setTouched(allTouched)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const result = await azureService.validateAzureConnectionInline(formData)
      setSubmitStatus("success")
      showToast(result.message || "Connection validated successfully", "success")
      onSubmit(formData)
      onCancel()
    } catch (error) {
      setSubmitStatus("error")
      showToast("An error occurred while validating the connection.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onCancel()
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className="!p-0 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-900 border-0 shadow-2xl rounded-2xl [&>button]:hidden flex flex-col"
        style={{
          height: "min(90vh, 800px)", // Fixed height instead of max-height
          maxHeight: "90vh",
        }}
      >
        <DialogHeader className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-white">Add Azure Connection</DialogTitle>
                <p className="text-purple-100 text-xs sm:text-sm mt-1">Configure your Azure environment connection</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-9 w-9 sm:h-10 sm:w-10 p-0 bg-white/25 hover:bg-white/35 border-2 border-white/40 hover:border-white/60 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white/60 shadow-lg backdrop-blur-sm flex items-center justify-center"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-white font-bold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f9fafb",
            minHeight: "400px", // Ensure minimum height to trigger scrolling
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 min-h-[500px]">
            {/* Connection Name */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Connection Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Production Environment"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={cn(
                  "h-11 sm:h-12 px-3 sm:px-4 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base",
                  errors.name && touched.name && "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                )}
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Tenant ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Tenant ID */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="tenantId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tenant ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tenantId"
                  placeholder="xxxxxxxx-xxxx-xxxx-xx"
                  value={formData.tenantId}
                  onChange={(e) => handleInputChange("tenantId", e.target.value)}
                  onBlur={() => handleBlur("tenantId")}
                  className={cn(
                    "h-11 sm:h-12 px-3 sm:px-4 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    errors.tenantId &&
                      touched.tenantId &&
                      "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                  )}
                  disabled={isSubmitting}
                />
                {errors.tenantId && touched.tenantId && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    {errors.tenantId}
                  </div>
                )}
              </div>

              {/* Subscription ID */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="subscriptionId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscription ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subscriptionId"
                  placeholder="xxxxxxxx-xxxx-xxxx-xx"
                  value={formData.subscriptionId}
                  onChange={(e) => handleInputChange("subscriptionId", e.target.value)}
                  onBlur={() => handleBlur("subscriptionId")}
                  className={cn(
                    "h-11 sm:h-12 px-3 sm:px-4 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    errors.subscriptionId &&
                      touched.subscriptionId &&
                      "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                  )}
                  disabled={isSubmitting}
                />
                {errors.subscriptionId && touched.subscriptionId && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    {errors.subscriptionId}
                  </div>
                )}
              </div>
            </div>

            {/* Client ID */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="clientId" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Client ID (Application ID) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientId"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={formData.clientId}
                onChange={(e) => handleInputChange("clientId", e.target.value)}
                onBlur={() => handleBlur("clientId")}
                className={cn(
                  "h-11 sm:h-12 px-3 sm:px-4 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  errors.clientId &&
                    touched.clientId &&
                    "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                )}
                disabled={isSubmitting}
              />
              {errors.clientId && touched.clientId && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {errors.clientId}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Client Secret */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="clientSecret" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Client Secret <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="clientSecret"
                    type={showSecret ? "text" : "password"}
                    placeholder="Enter client secret"
                    value={formData.clientSecret}
                    onChange={(e) => handleInputChange("clientSecret", e.target.value)}
                    onBlur={() => handleBlur("clientSecret")}
                    className={cn(
                      "h-11 sm:h-12 px-3 sm:px-4 pr-10 sm:pr-12 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm sm:text-base",
                      errors.clientSecret &&
                        touched.clientSecret &&
                        "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                    )}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    disabled={isSubmitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center rounded"
                  >
                    {showSecret ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.clientSecret && touched.clientSecret && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    {errors.clientSecret}
                  </div>
                )}
              </div>

              {/* Environment Type */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="environment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Environment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value) => handleInputChange("environment", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11 sm:h-12 px-3 sm:px-4 bg-rose-50 dark:bg-gray-800 border border-rose-200 dark:border-gray-600 rounded-lg focus:border-rose-300 dark:focus:border-purple-400 focus:ring-2 focus:ring-rose-100 dark:focus:ring-purple-400/20 text-gray-900 dark:text-gray-100 text-sm sm:text-base",
                      errors.environment &&
                        touched.environment &&
                        "border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20",
                    )}
                  >
                    <SelectValue placeholder="Development" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <SelectItem value="Development" className="text-gray-900 dark:text-gray-100">
                      Development
                    </SelectItem>
                    <SelectItem value="Staging" className="text-gray-900 dark:text-gray-100">
                      Staging
                    </SelectItem>
                    <SelectItem value="Production" className="text-gray-900 dark:text-gray-100">
                      Production
                    </SelectItem>
                    <SelectItem value="Testing" className="text-gray-900 dark:text-gray-100">
                      Testing
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.environment && touched.environment && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    {errors.environment}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Status Messages */}
            {submitStatus === "success" && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                  Connection validated successfully!
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-red-800 dark:text-red-200 text-sm font-medium">
                  An error occurred while validating the connection.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2.5 sm:py-3 h-10 sm:h-12 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 sm:px-8 py-2.5 sm:py-3 h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Testing...
                </>
              ) : (
                "Validate & Save Connection"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConnectionForm
