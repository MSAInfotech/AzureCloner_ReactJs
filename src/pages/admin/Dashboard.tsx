"use client"

import type React from "react"
import { useStore } from "@store/useStore"
import {
  Database,
  Shield,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/admin/ui/Card"

const Dashboard: React.FC = () => {
  const { connections, deploymentJobs, resources } = useStore()

  const activeConnections = connections.filter((c) => c.status === "connected").length
  const runningJobs = deploymentJobs.filter((j) => j.status === "running").length
  const completedJobs = deploymentJobs.filter((j) => j.status === "completed").length
  const totalResources = resources.length

  const recentActivity = [
    { type: "success", message: "Production connection validated", time: "2m ago" },
    { type: "success", message: "Staging connection validated", time: "5m ago" },
    { type: "error", message: "Development connection failed", time: "1h ago" },
  ]

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#eef2ff] via-white to-[#e0f2fe] text-gray-800">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your Azure resource cloning operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Active Connections"
          value={activeConnections}
          icon={Shield}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Total Resources"
          value={totalResources}
          icon={Database}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <StatCard
          title="Completed Jobs"
          value={completedJobs}
          icon={CheckCircle}
          color="text-violet-600"
          bgColor="bg-violet-50"
        />
        <StatCard
          title="Running Jobs"
          value={runningJobs}
          icon={Activity}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Recent Activity and Connection Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                {activity.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardHeader>
            <CardTitle>Connection Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Connected</span>
              <span className="text-2xl font-bold text-emerald-600">{activeConnections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Disconnected</span>
              <span className="text-2xl font-bold text-rose-600">
                {connections.filter((c) => c.status === "error").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Resources</span>
              <span className="text-2xl font-bold text-gray-900">{totalResources}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Running Jobs */}
      {runningJobs > 0 && (
        <Card className="mt-6 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
          <CardHeader>
            <CardTitle>Active Deployments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deploymentJobs
              .filter((job) => job.status === "running")
              .map((job) => (
                <div key={job.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{job.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Deploying {job.resources.length} resources
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}) => {
  return (
    <Card className={`rounded-2xl shadow-md hover:shadow-xl transition duration-300 ${bgColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard
