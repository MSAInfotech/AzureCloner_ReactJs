"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import {
  Search, Download, RefreshCw, Server, Database, Globe, Shield, HardDrive, Network, Cloud
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
import { useToast } from "@hooks/useToast"

const ResourceDiscovery: React.FC = () => {
  const { connections, fetchConnections, resources, selectedResources, setResources, setSelectedResources, setLoading, setError} = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const { showToast } = useStore()

  useEffect(() => {
    if (connections.length === 0) {
      fetchConnections()
    }
  }, [connections])

  const discoverResources = async (connectionId: string) => {
    try {
      setLoading(true)
      const discoveredResources = await azureService.discoverResources(connectionId)
      setResources(discoveredResources)
      showToast(`Discovered ${discoveredResources.length} resources`, "success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to discover resources")
      showToast("Failed to discover resources", "error")
    } finally {
      setLoading(false)
    }
  }

  const DiscoverySession = async (subscriptionId: string, connectionId: string) => {
    try {
      setLoading(true)
      const result = await azureService.startDiscoverySession(subscriptionId,connectionId)
      // Check if response includes both session and discoveredResources
      const { session, discoveredResources } = result
      // Set source environment value globally
      // setSelectedSourceEnv(sourceEnvID,session.id)
      showToast(`Discovery session started (ID: ${session.id})`, "success")
      setResources(discoveredResources || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start  discover resources")
      showToast("Failed to start discover resources", "error")
    } finally {
      setLoading(false)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "microsoft.web/sites":
        return <Globe className="h-4 w-4 text-blue-600" />
      case "microsoft.sql/servers":
        return <Database className="h-4 w-4 text-green-600" />
      case "microsoft.compute/virtualmachines":
        return <Server className="h-4 w-4 text-purple-600" />
      case "microsoft.storage/storageaccounts":
        return <HardDrive className="h-4 w-4 text-orange-500" />
      case "microsoft.network/virtualnetworks":
        return <Network className="h-4 w-4 text-indigo-500" />
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />
    }
  }

  const handleSelectResource = (resourceId: string) => {
    const newSelection = selectedResources.includes(resourceId)
      ? selectedResources.filter((id) => id !== resourceId)
      : [...selectedResources, resourceId]
    setSelectedResources(newSelection)
  }

  const handleSelectAll = () => {
    const allResourceIds = resources.map((r) => r.id)
    setSelectedResources(selectedResources.length === allResourceIds.length ? [] : allResourceIds)
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || resource.type.toLowerCase().includes(filterType.toLowerCase())
    return matchesSearch && matchesFilter
  })

  const exportSelected = () => {
    const selectedResourceData = resources.filter((r) => selectedResources.includes(r.id))
    const dataStr = JSON.stringify(selectedResourceData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "azure-resources.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    showToast(`Exported ${selectedResourceData.length} resources`, "success")
  }

  return (
    <div className="space-y-6 min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Discovery</h1>
          <p className="text-gray-600">Discover and analyze Azure resources across your environments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => selectedConnection && discoverResources(selectedConnection)} disabled={!selectedConnection}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={exportSelected} disabled={selectedResources.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* Select Connection */}
      <Card className="bg-white shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Select Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <select
              value={selectedConnection?.id || ""}
              onChange={(e) => {
                const conn = connections.find((c) => c.id === e.target.value)
                setSelectedConnection(conn ?? null)
              }}
              className="w-full sm:w-auto flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a connection to discover resources</option>
              {connections
                .filter((c) => c.status === "connected")
                .map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.name} ({connection.environment})
                  </option>
                ))}
            </select>

            <Button
              onClick={() => selectedConnection && DiscoverySession(selectedConnection.subscriptionId,selectedConnection.id)}
              disabled={!selectedConnection}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Discover Resources
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Resources</option>
          <option value="microsoft.web/sites">App Services</option>
          <option value="microsoft.sql/servers">SQL Servers</option>
          <option value="microsoft.compute/virtualmachines">Virtual Machines</option>
          <option value="microsoft.storage/storageaccounts">Storage Accounts</option>
          <option value="microsoft.network/virtualnetworks">Virtual Networks</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-indigo-50 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Cloud className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{selectedResources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resource Groups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(resources.map((r) => r.resourceGroup)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Network className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dependencies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resources.reduce((total, r) => total + r.dependencies.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Table */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Discovered Resources</CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedResources.length === filteredResources.length && filteredResources.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-600">Select All</label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Select", "Resource Name", "Type", "Resource Group", "Location", "Dependencies", "Tags"].map((text) => (
                    <th key={text} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{text}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedResources.includes(resource.id)}
                        onChange={() => handleSelectResource(resource.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getResourceIcon(resource.type)}
                        <div className="ml-3 text-sm font-medium text-gray-900">{resource.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><Badge variant="secondary">{resource.resourceGroup}</Badge></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{resource.location}</td>
                    <td className="px-6 py-4"><Badge variant="outline">{resource.dependencies.length}</Badge></td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-1">
                        {Object.entries(resource.tags).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs shrink-0">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResourceDiscovery
