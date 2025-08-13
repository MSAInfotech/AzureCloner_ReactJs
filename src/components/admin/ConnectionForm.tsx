"use client"

import type React from "react"
import { useState } from "react"
import type { AzureConnection } from "@services/azureService"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { azureService } from "@services/azureService"
import { useStore } from "@store/useStore"


interface ConnectionFormProps {
  onSubmit: (connection: Omit<AzureConnection, "id" | "status" | "lastValidated">) => void
  onCancel: () => void
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    subscriptionId: "",
    tenantId: "",
    clientId: "",
    clientSecret: "",
    environment: "Development",
    latestSessionId:""
  })
  const [showClientSecret, setShowClientSecret] = useState(false)
  const { showToast } = useStore()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await azureService.validateAzureConnectionInline(formData);
      showToast(result.message || "Connection validated successfully","success");
      onSubmit(formData); // Save connection to store
      onCancel(); // Close modal
    } catch (error) {
      console.error("Validation error:", error);
      showToast("An error occurred while validating the connection.","error");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Azure Connection</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Connection Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Production Environment"
            />
          </div>

          <div>
            <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700">
              Tenant ID
            </label>
            <Input
              type="text"
              id="tenantId"
              name="tenantId"
              required
              value={formData.tenantId}
              onChange={handleChange}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">
              Subscription ID
            </label>
            <Input
              type="text"
              id="subscriptionId"
              name="subscriptionId"
              required
              value={formData.subscriptionId}
              onChange={handleChange}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
              Client ID (Application ID)
            </label>
            <Input
              type="text"
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div>
            <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">
              Client Secret
            </label>
            <div className="mt-1 relative">
              <Input
                type={showClientSecret ? "text" : "password"}
                id="clientSecret"
                name="clientSecret"
                value={formData.clientSecret}
                onChange={handleChange}
                placeholder="Enter client secret"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowClientSecret(!showClientSecret)}
              >
                {showClientSecret ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="environment" className="block text-sm font-medium text-gray-700">
              Environment Type
            </label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Development">Development</option>
              <option value="Staging">Staging</option>
              <option value="Production">Production</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Test & Save Connection</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConnectionForm
