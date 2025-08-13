"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import { Play, Pause, Square, CheckCircle, AlertCircle, Clock, FileText, Download, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
import { Progress } from "@components/admin/ui/Progress"

const Deployments: React.FC = () => {
  const {
    connections,
    fetchConnections,
    resources,
    selectedResources,
    deploymentJobs,
    addDeploymentJob,
    setLoading,
    connectionsWithDiscoverySessions,
    getConnectionsWithDiscoverySessions
  } = useStore()

  const [selectedSourceEnv, setSelectedSourceEnv] = useState("")
  const [selectedTargetEnv, setSelectedTargetEnv] = useState("")
  const [deploymentName, setDeploymentName] = useState("")
  const { showToast } = useStore()

  useEffect(() => {
    fetchConnections()
    getConnectionsWithDiscoverySessions()
  }, [fetchConnections, getConnectionsWithDiscoverySessions])

  const connectedConnections = connections.filter(
    (conn) => conn.status === "connected"
  )
  const selectedSourceConnId = connectionsWithDiscoverySessions.find(
  (conn) => conn.latestSessionId === selectedSourceEnv
)?.id

  const handleCreateDeployment = async () => {
    if (!selectedSourceEnv || !selectedTargetEnv || !deploymentName) {
      showToast("Please fill all required fields and select resources", "error")
      return
    }

    try {
      setLoading(true)
      const selectedResourceData = resources.filter((r) => selectedResources.includes(r.id))

      const deploymentJob = await azureService.deployResources(
        selectedSourceEnv,
        selectedTargetEnv,
        selectedResourceData,
        deploymentName,
      )

      addDeploymentJob(deploymentJob)
      showToast("Deployment started successfully", "success")

      // setDeploymentName("")
      setSelectedSourceEnv("")
      setSelectedTargetEnv("")
    } catch (error) {
      showToast("Failed to start deployment", "error")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      running: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      paused: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const activeDeployments = deploymentJobs.filter((job) => job.status === "running").length
  const completedToday = deploymentJobs.filter(
    (job) =>
      job.status === "completed" && job.endTime && new Date(job.endTime).toDateString() === new Date().toDateString(),
  ).length
  const successRate =
    deploymentJobs.length > 0
      ? ((deploymentJobs.filter((job) => job.status === "completed").length / deploymentJobs.length) * 100).toFixed(1)
      : "0"

  return (
    <div className="space-y-6 min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-sky-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deployment Pipeline</h1>
          <p className="text-gray-600">Manage and monitor your Azure resource deployment jobs</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-purple-50 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Create New Deployment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* form fields */}
            <div className="bg-emerald-50 p-3 rounded-md">
              <p className="text-sm text-emerald-700">{selectedResources.length} resources selected for deployment</p>
            </div>
            {/* Deployment Name Field */}
            <div className="space-y-2">
              <label htmlFor="deploymentName" className="block text-sm font-medium text-gray-700">
                Deployment Name
              </label>
              <Input
                id="deploymentName"
                type="text"
                placeholder="Enter deployment name"
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {/* Source Environment Dropdown */}
              <label htmlFor="sourceEnv" className="block text-sm font-medium text-gray-700">
                Source Environment
              </label>
              <select
                id="sourceEnv"
                value={selectedSourceEnv}
                onChange={(e) => setSelectedSourceEnv(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Source Environment --</option>
                {connectionsWithDiscoverySessions.map((conn) => (
                  <option key={conn.id} value={conn.latestSessionId}>
                    {conn.name} ({conn.environment})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              {/* Target Environment Dropdown */}
              <label htmlFor="targetEnv" className="block text-sm font-medium text-gray-700">
                Target Environment
              </label>
              <select
                id="targetEnv"
                value={selectedTargetEnv}
                onChange={(e) => setSelectedTargetEnv(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Target Environment --</option>
                {connectedConnections
                  .filter((conn) => conn.id !== selectedSourceConnId) // ⬅ remove selected source from target list
                  .map((conn) => (
                    <option key={conn.id} value={conn.id}>
                      {conn.name} ({conn.environment})
                    </option>
                  ))}
              </select>
            </div>

            <Button
              onClick={handleCreateDeployment}
              disabled={!selectedSourceEnv || !selectedTargetEnv || !deploymentName}
              className="w-full"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Deployment
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Deployment Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Active Deployments</span>
              <span className="text-2xl font-bold text-blue-600">{activeDeployments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Completed Today</span>
              <span className="text-2xl font-bold text-green-600">{completedToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Success Rate</span>
              <span className="text-2xl font-bold text-gray-900">{successRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Jobs</span>
              <span className="text-2xl font-bold text-gray-900">{deploymentJobs.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 shadow-md backdrop-blur-sm rounded-2xl">
        <CardHeader>
          <CardTitle>Active & Recent Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentJobs.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deployments</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first deployment.</p>
              </div>
            ) : (
              deploymentJobs.map((job) => (
                <div key={job.id} className="border rounded-2xl p-4 space-y-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h4 className="font-semibold">{job.name}</h4>
                        <p className="text-sm text-gray-500">
                          {connections.find((c) => c.id === job.sourceDiscoverySessionId)?.name} → {connections.find((c) => c.id === job.targetConnectionId)?.name} • {job.resources.length} resources
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(job.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {job.status === "running" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Started: {job.startTime ? new Date(job.startTime).toLocaleString() : "Not started"}</span>
                    <span>{job.endTime ? `Completed: ${new Date(job.endTime).toLocaleString()}` : "In progress"}</span>
                  </div>

                  {job.errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 rounded-md p-3">
                      <p className="text-sm text-rose-700">{job.errorMessage}</p>
                    </div>
                  )}

                  {job.status === "running" && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Pause className="mr-1 h-3 w-3" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm">
                        <Square className="mr-1 h-3 w-3" />
                        Stop
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Deployments
