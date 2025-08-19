"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import {
  Search,
  Download,
  RefreshCw,
  Server,
  Database,
  Globe,
  Shield,
  Filter,
  HardDrive,
  Network,
  Cloud,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
const ResourceDiscovery: React.FC = () => {
  const {
    connections,
    fetchConnections,
    resources,
    selectedResources,
    setResources,
    setSelectedResources,
    setLoading,
    setError,
  } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [isDiscovering, setDiscovering] = useState(false)
  const { showToast } = useStore()

  useEffect(() => {
    if (connections.length === 0) {
      fetchConnections()
    }
  }, [connections,fetchConnections])

  const discoverResources = async (connectionId: string) => {
    try {
      setDiscovering(true)
      setLoading(true)
      const discoveredResources = await azureService.discoverResources(connectionId)
      setResources(discoveredResources)
      showToast(`Discovered ${discoveredResources.length} resources`, "success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to discover resources")
      showToast("Failed to discover resources", "error")
    } finally {
      setLoading(false)
      setDiscovering(false)
    }
  }

  const DiscoverySession = async (subscriptionId: string, connectionId: string) => {
    try {
      setDiscovering(true)
      setLoading(true)
      const result = await azureService.startDiscoverySession(subscriptionId, connectionId)
      const { session, discoveredResources } = result
      showToast(`Discovery session started (ID: ${session.id})`, "success")
      setResources(discoveredResources || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start discover resources")
      showToast("Failed to start discover resources", "error")
    } finally {
      setLoading(false)
      setDiscovering(false)
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
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      ></div>

      <div className="relative p-6 lg:p-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Resource Discovery
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Discover and analyze Azure resources across your environments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => selectedConnection && discoverResources(selectedConnection.id)}
              disabled={!selectedConnection || isDiscovering}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isDiscovering ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              onClick={exportSelected}
              disabled={selectedResources.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"
            >
              <Download className="h-4 w-4" />
              Export Selected
            </Button>
          </div>
        </div>

        {/* Select Connection */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-600" />
              Select Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="relative w-full lg:max-w-md xl:max-w-lg">
                <select
                  value={selectedConnection?.id || ""}
                  onChange={(e) => {
                    const conn = connections.find((c) => c.id === e.target.value)
                    setSelectedConnection(conn ?? null)
                  }}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm h-10"
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
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              <Button
                onClick={() =>
                  selectedConnection && DiscoverySession(selectedConnection.subscriptionId, selectedConnection.id)
                }
                disabled={!selectedConnection || isDiscovering}
                className="lg:w-auto w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-2 rounded-lg font-medium flex items-center gap-2 h-10 text-sm lg:min-w-[180px] xl:min-w-[200px]"
              >
                <RefreshCw className={`h-4 w-4 ${isDiscovering ? "animate-spin" : ""}`} />
                {isDiscovering ? "Discovering..." : "Discover Resources"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl px-4 py-3 pr-10 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] shadow-sm"
            >
              <option value="all">All Resources</option>
              <option value="microsoft.web/sites">App Services</option>
              <option value="microsoft.sql/servers">SQL Servers</option>
              <option value="microsoft.compute/virtualmachines">Virtual Machines</option>
              <option value="microsoft.storage/storageaccounts">Storage Accounts</option>
              <option value="microsoft.network/virtualnetworks">Virtual Networks</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Resources",
              count: resources.length,
              icon: Cloud,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Selected",
              count: selectedResources.length,
              icon: Shield,
              gradient: "from-emerald-500 to-emerald-600",
            },
            {
              label: "Resource Groups",
              count: new Set(resources.map((r) => r.resourceGroup)).size,
              icon: Database,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "Dependencies",
              count: resources.reduce((total, r) => total + r.dependencies.length, 0),
              icon: Network,
              gradient: "from-orange-500 to-orange-600",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl"
            >
              <CardContent className="p-6 flex items-center gap-6">
                <div
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 shadow-md group-hover:shadow-xl transition-shadow duration-300`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.count}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Table */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Server className="h-5 w-5 text-slate-600" />
                Discovered Resources
              </CardTitle>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedResources.length === filteredResources.length && filteredResources.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label className="text-sm text-slate-600 font-medium">Select All</label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    {["SELECT", "RESOURCE NAME", "TYPE", "RESOURCE GROUP", "LOCATION", "DEPENDENCIES", "TAGS"].map(
                      (text) => (
                        <th
                          key={text}
                          className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider"
                        >
                          {text}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedResources.includes(resource.id)}
                          onChange={() => handleSelectResource(resource.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-xl shadow-sm">{getResourceIcon(resource.type)}</div>
                          <div className="text-sm font-semibold text-slate-900">{resource.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{resource.type}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`font-medium px-3 py-1 text-xs rounded-full shadow-sm ${resource.resourceGroup.toLowerCase().includes("dev") ||
                            resource.resourceGroup.toLowerCase().includes("development")
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : resource.resourceGroup.toLowerCase().includes("staging") ||
                              resource.resourceGroup.toLowerCase().includes("stage")
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : resource.resourceGroup.toLowerCase().includes("test") ||
                                resource.resourceGroup.toLowerCase().includes("testing")
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : resource.resourceGroup.toLowerCase().includes("prod") ||
                                  resource.resourceGroup.toLowerCase().includes("production")
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                            } border`}
                        >
                          {resource.resourceGroup}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border font-medium px-3 py-1 text-xs rounded-full shadow-sm">
                          {resource.location}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-slate-50 text-slate-700 border-slate-200 border text-xs px-2 py-1 rounded-md">
                          {resource.dependencies.length}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 max-w-[300px]">
                        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 px-1">
                          {Object.entries(resource.tags).map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="outline"
                              className="text-xs shrink-0 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors duration-200 px-2 py-1 rounded-md"
                            >
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
    </div>
  )
}

export default ResourceDiscovery
