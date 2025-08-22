"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/admin/ui/select"
import { Label } from "@components/admin/ui/label"

interface FilterState {
  search: string
  resourceType: string
  resourceGroup: string
  location: string
}

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

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    resourceType: "",
    resourceGroup: "",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [isDiscovering, setDiscovering] = useState(false)
  const { showToast } = useStore()

  useEffect(() => {
    if (connections.length === 0) {
      fetchConnections()
    }
  }, [connections, fetchConnections])

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
    const allResourceIds = filteredResources.map((r) => r.id)
    setSelectedResources(selectedResources.length === allResourceIds.length ? [] : allResourceIds)
  }

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        !filters.search ||
        resource.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.type.toLowerCase().includes(filters.search.toLowerCase())

      const matchesResourceType =
        !filters.resourceType || resource.type.toLowerCase().includes(filters.resourceType.toLowerCase())

      const matchesResourceGroup =
        !filters.resourceGroup || resource.resourceGroup.toLowerCase().includes(filters.resourceGroup.toLowerCase())

      const matchesLocation =
        !filters.location || resource.location.toLowerCase().includes(filters.location.toLowerCase())

      return matchesSearch && matchesResourceType && matchesResourceGroup && matchesLocation
    })
  }, [resources, filters])

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(0) // Reset to first page on filter change
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      resourceType: "",
      resourceGroup: "",
      location: "",
    })
    setCurrentPage(0)
  }

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== "")

  const uniqueResourceTypes = Array.from(new Set(resources.map((r) => r.type)))
  const uniqueResourceGroups = Array.from(new Set(resources.map((r) => r.resourceGroup)))
  const uniqueLocations = Array.from(new Set(resources.map((r) => r.location)))

  const pageCount = Math.ceil(filteredResources.length / itemsPerPage)
  const paginatedResources = useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return filteredResources.slice(start, end)
  }, [filteredResources, currentPage, itemsPerPage])

  const generateRowOptions = (total: number) => {
    if (total <= 5) return [total]
    const options: number[] = [5]
    let value = 10
    while (value < total) {
      options.push(value)
      value *= 2
    }
    if (!options.includes(total)) options.push(total)
    return options
  }

  const rowOptions = useMemo(() => generateRowOptions(filteredResources.length), [filteredResources])

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

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 w-full">
          {[
            {
              label: "Total Resources",
              count: filteredResources.length,
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
              count: new Set(filteredResources.map((r) => r.resourceGroup)).size,
              icon: Database,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "Dependencies",
              count: filteredResources.reduce((total, r) => total + r.dependencies.length, 0),
              icon: Network,
              gradient: "from-orange-500 to-orange-600",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="group relative flex flex-col justify-center bg-white border-0 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 rounded-2xl w-full h-full"
            >
              <CardContent className="p-4 lg:p-6 flex items-center gap-4 lg:gap-6">
                <div
                  className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 lg:p-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex items-center justify-center aspect-square`}
                >
                  <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.count}</p>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 ${showFilters ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">
                      {Object.values(filters).filter((f) => f !== "").length}
                    </Badge>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedResources.length === paginatedResources.length && paginatedResources.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label className="text-sm text-slate-600 font-medium">Select All</label>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search resources..."
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="pl-10 h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Resource Type</Label>
                  <Select
                    value={filters.resourceType}
                    onValueChange={(value) => updateFilter("resourceType", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm p-1">
                      <SelectItem
                        value="all"
                        className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                      >
                        All types
                      </SelectItem>
                      {uniqueResourceTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Resource Group</Label>
                  <Select
                    value={filters.resourceGroup}
                    onValueChange={(value) => updateFilter("resourceGroup", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                      <SelectValue placeholder="All groups" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm p-1">
                      <SelectItem
                        value="all"
                        className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                      >
                        All groups
                      </SelectItem>
                      {uniqueResourceGroups.map((group) => (
                        <SelectItem
                          key={group}
                          value={group}
                          className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => updateFilter("location", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm p-1">
                      <SelectItem
                        value="all"
                        className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                      >
                        All locations
                      </SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location}
                          className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
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
                  {filteredResources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="text-slate-500">
                          {hasActiveFilters ? "No resources match your filters" : "No resources found"}
                        </div>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-2 text-blue-600 hover:text-blue-700"
                          >
                            Clear filters
                          </Button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedResources.map((resource) => (
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
                            <div className="p-2 bg-slate-100 rounded-xl shadow-sm">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div className="text-sm font-semibold text-slate-900">{resource.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">{resource.type}</td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`font-medium px-3 py-1 text-xs rounded-full shadow-sm ${
                              resource.resourceGroup.toLowerCase().includes("dev") ||
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
                    ))
                  )}
                </tbody>
              </table>

              {filteredResources.length > 0 && (
                <div className="flex justify-between items-center p-4 text-sm text-slate-700">
                  {/* Rows per page selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Rows per page:</label>
                    <div className="relative">
                      <select
                        className="appearance-none border border-slate-300 rounded-lg pr-8 pl-2 py-2 text-sm bg-white hover:bg-slate-50 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-w-[70px]"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value))
                          setCurrentPage(0)
                        }}
                      >
                        {rowOptions.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Pagination info and controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="text-sm text-slate-600 font-medium">
                      Showing {currentPage * itemsPerPage + 1} to{" "}
                      {Math.min((currentPage + 1) * itemsPerPage, filteredResources.length)} of{" "}
                      {filteredResources.length} entries
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        className="px-4 py-2 text-sm font-medium border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-600 font-medium px-2">
                          Page {currentPage + 1} of {pageCount || 1}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage + 1 >= pageCount}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
                        className="px-4 py-2 text-sm font-medium border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResourceDiscovery
