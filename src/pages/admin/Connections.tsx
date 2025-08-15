"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import { Plus, Settings, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import ConnectionForm from "@components/admin/ConnectionForm"

const Connections: React.FC = () => {
  const { connections, setConnections, removeConnection, setLoading, setError, showToast } = useStore()
  const [showForm, setShowForm] = useState(false)

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
              Azure Connections
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Manage and monitor all your Azure environment connections
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 rounded-xl font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add Connection
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Active Connections",
              count: connections.filter((c) => c.status === "connected").length,
              icon: CheckCircle,
              gradient: "from-emerald-500 to-emerald-600",
            },
            {
              label: "Failed Connections",
              count: connections.filter((c) => c.status === "error").length,
              icon: AlertCircle,
              gradient: "from-rose-500 to-rose-600",
            },
            {
              label: "Total Connections",
              count: connections.length,
              icon: Settings,
              gradient: "from-indigo-500 to-indigo-600",
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

        {/* Table */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900">Connection List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    {["Connection", "Environment", "Status", "Last Validated", "Actions"].map((text) => (
                      <th
                        key={text}
                        className={`px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider ${
                          text === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {connections.map((connection) => (
                    <tr
                      key={connection.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(connection.status)}
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {connection.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">{connection.subscriptionId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                          {getEnvironmentBadge(connection.environment)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(connection.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{connection.lastValidated.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConnection(connection.id)}
                          className="text-rose-600 hover:bg-rose-50 transition-all duration-200 p-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {showForm && <ConnectionForm onSubmit={handleCreateConnection} onCancel={() => setShowForm(false)} />}
      </div>
    </div>
  )
}

export default Connections
