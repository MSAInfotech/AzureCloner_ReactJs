"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Download,
  Eye,
  Zap,
  TrendingUp,
  Activity,
  ChevronDown
} from "lucide-react"
import { useStore } from "@store/useStore"
import { azureService } from "@services/azureService"
import { Card, CardContent, CardHeader, CardTitle } from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Input } from "@components/admin/ui/Input"
import { Progress } from "@components/admin/ui/Progress"

interface Connection {
  id: string
  name: string
  environment: string
  status: string
  latestSessionId?: string
}

interface DeploymentJob {
  id: string
  name: string
  status: string
  progress: number
  startTime?: string
  endTime?: string
  sourceDiscoverySessionId: string
  targetConnectionId: string
  resources: any[]
  errorMessage?: string
}

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
    getConnectionsWithDiscoverySessions,
    showToast
  } = useStore()

  const [selectedSourceEnv, setSelectedSourceEnv] = useState("")
  const [selectedTargetEnv, setSelectedTargetEnv] = useState("")
  const [deploymentName, setDeploymentName] = useState("")

  useEffect(() => {
    fetchConnections()
    getConnectionsWithDiscoverySessions()
  }, [fetchConnections, getConnectionsWithDiscoverySessions])

  const connectedConnections = connections.filter((conn) => conn.status === "connected")
  const selectedSourceConnId = connectionsWithDiscoverySessions.find(
    (conn) => conn.latestSessionId === selectedSourceEnv,
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
      showToast("Deployment completed successfully", "success")

      setDeploymentName("")
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
      running: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
      completed: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25",
      failed: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25",
      paused: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25",
      pending: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25",
    }

    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles]} border-0 px-3 py-1 font-medium`}>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 p-3 sm:p-6">
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Deployment Pipeline
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium ml-8 sm:ml-14">
          Manage and monitor your Azure resource deployment jobs
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 xl:grid-cols-2 mb-8 sm:mb-12">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-purple-500/10 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl">
                <Play className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              Create New Deployment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-500 rounded-xl">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <p className="text-sm sm:text-base text-emerald-800 font-semibold">
                  {selectedResources.length} resources selected for deployment
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="deploymentName" className="block text-sm font-semibold text-gray-700 mb-2">
                Deployment Name
              </label>
              <Input
                id="deploymentName"
                type="text"
                placeholder="Enter deployment name"
                value={deploymentName}
                onChange={(e) => setDeploymentName(e.target.value)}
                className="h-10 sm:h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sourceEnv" className="block text-sm font-semibold text-gray-700 mb-2">
                Source Environment
              </label>
              <div className="relative">
                <select
                  id="sourceEnv"
                  value={selectedSourceEnv}
                  onChange={(e) => setSelectedSourceEnv(e.target.value)}
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white font-medium text-sm sm:text-base appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-500">
                    Select Source Environment
                  </option>
                  {connectionsWithDiscoverySessions.map((conn) => (
                    <option key={conn.id} value={conn.latestSessionId} className="text-gray-900 py-2">
                      {conn.name} ({conn.environment})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="targetEnv" className="block text-sm font-semibold text-gray-700 mb-2">
                Target Environment
              </label>
              <div className="relative">
                <select
                  id="targetEnv"
                  value={selectedTargetEnv}
                  onChange={(e) => setSelectedTargetEnv(e.target.value)}
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 py-2 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-white font-medium text-sm sm:text-base appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-500">
                    Select Target Environment
                  </option>
                  {connectedConnections
                    .filter((conn) => conn.id !== selectedSourceConnId)
                    .map((conn) => (
                      <option key={conn.id} value={conn.id} className="text-gray-900 py-2">
                        {conn.name} ({conn.environment})
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <Button
              onClick={handleCreateDeployment}
              disabled={!selectedSourceEnv || !selectedTargetEnv || !deploymentName}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Start Deployment
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-blue-500/10 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              Deployment Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">{activeDeployments}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-blue-800">Active Deployments</span>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  <span className="text-2xl sm:text-3xl font-bold text-green-600">{completedToday}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-green-800">Completed Today</span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  <span className="text-2xl sm:text-3xl font-bold text-purple-600">{successRate}%</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-purple-800">Success Rate</span>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">{deploymentJobs.length}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800">Total Jobs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-gray-500/10 rounded-2xl sm:rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 text-white pb-4 sm:pb-6">
          <CardTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl">
              <Activity className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            Active & Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 sm:space-y-6">
            {deploymentJobs.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl inline-block mb-4 sm:mb-6">
                  <FileText className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No deployments</h3>
                <p className="text-base sm:text-lg text-gray-500">Get started by creating your first deployment.</p>
              </div>
            ) : (
              deploymentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl">
                        {getStatusIcon(job.status)}
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900">{job.name}</h4>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">
                          {connections.find((c) => c.latestSessionId === job.sourceDiscoverySessionId)?.name} →{" "}
                          {connections.find((c) => c.id === job.targetConnectionId)?.name} • {job.resources.length}{" "}
                          resources
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 self-start sm:self-center">
                      {getStatusBadge(job.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      </Button>
                    </div>
                  </div>

                  {job.status === "running" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-blue-600">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-3 bg-gray-200 rounded-full" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm font-medium text-gray-500 bg-gray-50 p-4 rounded-2xl">
                    <span>Started: {job.startTime ? new Date(job.startTime).toLocaleString() : "Not started"}</span>
                    <span>{job.endTime ? `Completed: ${new Date(job.endTime).toLocaleString()}` : "In progress"}</span>
                  </div>

                  {job.errorMessage && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-4">
                      <p className="text-red-700 font-medium">{job.errorMessage}</p>
                    </div>
                  )}

                  {job.status === "running" && (
                    <div className="flex items-center space-x-3 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-2 hover:bg-yellow-50 hover:border-yellow-300 transition-colors bg-transparent"
                      >
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-2 hover:bg-red-50 hover:border-red-300 transition-colors bg-transparent"
                      >
                        <Square className="mr-2 h-4 w-4" />
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
