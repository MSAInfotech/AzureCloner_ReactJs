"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore } from "@store/useStore"
import { azureService, type AzureConnection } from "@services/azureService"
import { Plus, Settings, Trash2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import ConnectionForm from "@components/admin/ConnectionForm"
// import { useToast } from "@hooks/useToast"

const Connections: React.FC = () => {
  const { connections, setConnections, addConnection, removeConnection, setLoading, setError } = useStore()
  const [showForm, setShowForm] = useState(false)
  const { showToast } = useStore()

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
    await loadConnections(); // ✅ Refetch the updated list from backend
    setShowForm(false);
    showToast("Connection created successfully", "success");
  };

  const handleValidateConnection = async (connection: AzureConnection) => {
    try {
      setLoading(true)
      await azureService.validateConnection(connection)
      await loadConnections()
      showToast("Connection validated successfully", "success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to validate connection")
      showToast("Failed to validate connection", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConnection = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this connection?")) {
      try {
        await azureService.deleteConnection(id)
        removeConnection(id)
        showToast("Connection deleted successfully", "success")
      } catch (error) {
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
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 min-h-screen p-6 bg-gradient-to-br from-[#eef2ff] via-white to-[#e0f2fe] text-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Azure Connections</h1>
          <p className="text-gray-600">Manage your Azure environment connections</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Active Connections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connections.filter((c) => c.status === "connected").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-rose-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <AlertCircle className="h-6 w-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Failed Connections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connections.filter((c) => c.status === "error").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-700">Total Connections</p>
                <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connections Table */}
      <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition duration-300">
        <CardHeader>
          <CardTitle>Connection List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Connection", "Environment", "Status", "Last Validated", "Actions"].map((text) => (
                    <th
                      key={text}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${text === "Actions" ? "text-right" : ""
                        }`}
                    >
                      {text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connections.map((connection) => (
                  <tr key={connection.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(connection.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{connection.name}</div>
                          <div className="text-sm text-gray-500">{connection.subscriptionId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{connection.environment}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(connection.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {connection.lastValidated.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* <Button variant="ghost" size="sm" onClick={() => handleValidateConnection(connection)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button> */}
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteConnection(connection.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ConnectionForm
          onSubmit={handleCreateConnection}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

export default Connections
