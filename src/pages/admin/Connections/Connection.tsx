"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import { Plus, Settings, Trash2, CheckCircle, AlertCircle, Search, X, Filter, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/admin/ui/select"
import ConnectionForm from "@components/admin/ConnectionForm"
import { Label } from "@components/admin/ui/label"
import { useNavigate } from "react-router-dom"

interface FilterState {
  connection: string
  environment: string
  status: string
  lastValidated: string
}

const Connections: React.FC = () => {
  const { connections, setConnections, removeConnection, setLoading, setError, showToast } = useStore()
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({
    connection: "",
    environment: "",
    status: "",
    lastValidated: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10) // Dynamic rows per page

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const loadedConnections = await azureService.getAllConnections()
      setConnections(loadedConnections)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load connections")
      showToast("Failed to load connections", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateConnection = async () => {
    await loadConnections()
    setShowForm(false)
    showToast("Connection created successfully", "success")
  }

  const handleDeleteConnection = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this connection?")) {
      try {
        await azureService.deleteConnection(id)
        removeConnection(id)
        showToast("Connection deleted successfully", "success")
      } catch {
        showToast("Failed to delete connection", "error")
      }
    }
  }

  const handleEditConnection = async (id: string) => {
    try {
      navigate(`/admin/connections/EditConnection/${id}`)
    } catch {
      showToast("Failed to delete connection", "error")
    }
  }

  const filteredConnections = useMemo(() => {
    return connections.filter((connection) => {
      const matchesConnection =
        !filters.connection ||
        connection.name.toLowerCase().includes(filters.connection.toLowerCase()) ||
        connection.subscriptionId.toLowerCase().includes(filters.connection.toLowerCase())

      const matchesEnvironment =
        !filters.environment || connection.environment.toLowerCase().includes(filters.environment.toLowerCase())

      const matchesStatus = !filters.status || connection.status.toLowerCase().includes(filters.status.toLowerCase())

      const matchesLastValidated =
        !filters.lastValidated ||
        connection.lastValidated.toLocaleString().toLowerCase().includes(filters.lastValidated.toLowerCase())

      return matchesConnection && matchesEnvironment && matchesStatus && matchesLastValidated
    })
  }, [connections, filters])

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(0) // Reset to first page on filter change
  }

  const clearFilters = () => {
    setFilters({
      connection: "",
      environment: "",
      status: "",
      lastValidated: "",
    })
    setCurrentPage(0)
  }

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== "")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      connected: "bg-emerald-100 text-emerald-800",
      error: "bg-rose-100 text-rose-800",
      disconnected: "bg-yellow-100 text-yellow-800",
    }
    return (
      <Badge
        className={`${statusStyles[status as keyof typeof statusStyles]} px-3 py-1 rounded-full text-xs font-semibold shadow-sm`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getEnvironmentBadge = (environment: string) => {
    const envStyles = {
      Production: "bg-purple-50 text-purple-700 border-purple-200",
      Development: "bg-blue-50 text-blue-700 border-blue-200",
      Testing: "bg-orange-50 text-orange-700 border-orange-200",
      Staging: "bg-indigo-50 text-indigo-700 border-indigo-200",
    }

    return (
      <Badge
        className={`${envStyles[environment as keyof typeof envStyles] || "bg-gray-50 text-gray-700 border-gray-200"} border px-2.5 py-1 rounded-md text-xs font-medium`}
      >
        {environment}
      </Badge>
    )
  }

  const uniqueEnvironments = Array.from(new Set(connections.map((c) => c.environment)))
  const uniqueStatuses = Array.from(new Set(connections.map((c) => c.status)))

  // Pagination logic
  const pageCount = Math.ceil(filteredConnections.length / itemsPerPage)
  const paginatedConnections = useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return filteredConnections.slice(start, end)
  }, [filteredConnections, currentPage, itemsPerPage])

  // Dynamically generate rows per page options (scales with total)
  const generateRowOptions = (total: number) => {
    if (total <= 5) return [total] // very small dataset

    const options: number[] = [5] // always start at 5
    let value = 10

    while (value < total) {
      options.push(value)
      value *= 2 // double each time
    }

    if (!options.includes(total)) options.push(total) // always include total
    return options
  }

  const rowOptions = useMemo(() => generateRowOptions(filteredConnections.length), [filteredConnections])

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
            <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Azure Connections
            </h1>
            <p className="text-slate-600 text-base lg:text-lg font-medium">
              Manage and monitor all your Azure environment connections
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            Add Connection
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 w-full">
          {[
            {
              label: "Active Connections",
              count: filteredConnections.filter((c) => c.status === "connected").length,
              icon: CheckCircle,
              gradient: "from-emerald-500 to-emerald-600",
            },
            {
              label: "Failed Connections",
              count: filteredConnections.filter((c) => c.status === "error").length,
              icon: AlertCircle,
              gradient: "from-rose-500 to-rose-600",
            },
            {
              label: "Total Connections",
              count: filteredConnections.length,
              icon: Settings,
              gradient: "from-indigo-500 to-indigo-600",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="group relative flex flex-col justify-center bg-white border-0 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 rounded-2xl w-full h-full"
            >
              <CardContent className="p-4 lg:p-6 flex items-center gap-4 lg:gap-6">
                {/* ICON WRAPPER - keep padding but force square + center */}
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

        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg lg:text-xl font-bold text-slate-900">Connection List</CardTitle>
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
              </div>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="mt-4 mx-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Connection</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search connections..."
                      value={filters.connection}
                      onChange={(e) => updateFilter("connection", e.target.value)}
                      className="pl-10 h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Environment</Label>
                  <Select
                    value={filters.environment}
                    onValueChange={(value) => updateFilter("environment", value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                      <SelectValue placeholder="All environments" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm p-1">
                      <SelectItem
                        value="all"
                        className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                      >
                        All environments
                      </SelectItem>
                      {uniqueEnvironments.map((env) => (
                        <SelectItem
                          key={env}
                          value={env}
                          className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors"
                        >
                          {env}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</Label>
                  <Select value={filters.status}
                    onValueChange={(value) => updateFilter("status", value === "all" ? "" : value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                      <SelectItem value="all">All statuses</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Last Validated</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search dates..."
                      value={filters.lastValidated}
                      onChange={(e) => updateFilter("lastValidated", e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="!p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    {["Connection", "Environment", "Status", "Last Validated", "Actions"].map((text) => (
                      <th
                        key={text}
                        className={`px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider ${text === "Actions" ? "text-right" : ""
                          }`}
                      >
                        {text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConnections.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 lg:px-6 py-8 text-center">
                        <div className="text-slate-500">
                          {hasActiveFilters ? "No connections match your filters" : "No connections found"}
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
                    paginatedConnections.map((connection) => (
                      <tr
                        key={connection.id}
                        className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300"
                      >
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(connection.status)}
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{connection.name}</div>
                              <div className="text-xs text-slate-500 font-mono">{connection.subscriptionId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">{getEnvironmentBadge(connection.environment)}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">{getStatusBadge(connection.status)}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-600">
                          {connection.lastValidated.toLocaleString()}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
                          <div className="flex items-center justify-end gap-1 lg:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditConnection(connection.id)}
                              className="text-blue-600 hover:bg-blue-50 transition-all duration-200 p-2 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConnection(connection.id)}
                              className="text-rose-600 hover:bg-rose-50 transition-all duration-200 p-2 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 text-sm text-slate-700">
                {/* Rows per page selector */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    Rows per page:
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none border border-slate-300 rounded-lg pr-8 pl-2 py-2 text-sm bg-white hover:bg-slate-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-w-[70px]"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(0) // Reset page to 0
                      }}
                    >
                      {rowOptions.map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>

                    {/* Custom Arrow */}
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
                  {/* Page info */}
                  <div className="text-sm text-slate-600 font-medium">
                    Showing {currentPage * itemsPerPage + 1} to{" "}
                    {Math.min((currentPage + 1) * itemsPerPage, filteredConnections.length)} of{" "}
                    {filteredConnections.length} entries
                  </div>

                  {/* Pagination controls */}
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
            </div>
          </CardContent>
        </Card>

        {showForm && <ConnectionForm onSubmit={handleCreateConnection} onCancel={() => setShowForm(false)} />}
      </div>
    </div>
  )
}

export default Connections
