"use client"

import type React from "react"
import { useState } from "react"
import { useStore } from "@store/useStore"
import {
  Database,
  Shield,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Server,
  Zap,
  Globe,
  ExternalLink,
  DollarSign,
  Gauge,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/admin/ui/Card"
import { Button } from "@components/admin/ui/Button"
import { Badge } from "@components/admin/ui/Badge"
import { Progress } from "@/components/admin/ui/Progress"

const Dashboard: React.FC = () => {
  // const { connections, deploymentJobs, resources } = useStore()
  const { deploymentJobs } = useStore()

  const [azureConnections] = useState([
    { id: 1, name: "Production Subscription", status: "connected", region: "East US", resourceCount: 24 },
    { id: 2, name: "Development Subscription", status: "connected", region: "West Europe", resourceCount: 12 },
    { id: 3, name: "Staging Subscription", status: "error", region: "Central US", resourceCount: 8 },
  ])
  const activeConnections = azureConnections.filter((c) => c.status === "connected").length
  const failedConnections = azureConnections.filter((c) => c.status === "error").length
  const runningJobs = deploymentJobs.filter((j) => j.status === "running").length
  // const completedJobs = deploymentJobs.filter((j) => j.status === "completed").length
  // const totalResources = resources.length

  const recentActivity = [
    { type: "success", message: "Production connection validated", time: "2m ago" },
    { type: "success", message: "Staging connection validated", time: "5m ago" },
    { type: "error", message: "Development connection failed", time: "1h ago" },
  ]
  const [securityInsights] = useState([
    { type: "Critical", count: 2, description: "Unencrypted storage accounts", severity: "high" },
    { type: "High", count: 5, description: "Missing network security groups", severity: "medium" },
    { type: "Medium", count: 12, description: "Outdated VM images", severity: "low" },
    { type: "Low", count: 8, description: "Unused public IPs", severity: "info" },
  ])
  const [performanceMetrics] = useState([
    { name: "CPU Utilization", value: 68, status: "normal", trend: "+5%" },
    { name: "Memory Usage", value: 82, status: "warning", trend: "+12%" },
    { name: "Storage I/O", value: 45, status: "normal", trend: "-3%" },
    { name: "Network Throughput", value: 73, status: "normal", trend: "+8%" },
  ])
  const [costOptimization] = useState([
    { recommendation: "Resize underutilized VMs", savings: "$156.40", impact: "High" },
    { recommendation: "Delete unused storage accounts", savings: "$89.20", impact: "Medium" },
    { recommendation: "Optimize SQL Database tiers", savings: "$234.80", impact: "High" },
    { recommendation: "Schedule VM auto-shutdown", savings: "$67.50", impact: "Low" },
  ])

  const [azureResources] = useState([
    { type: "App Services", count: 8, status: "healthy", cost: "$245.50" },
    { type: "SQL Databases", count: 4, status: "healthy", cost: "$189.20" },
    { type: "Storage Accounts", count: 6, status: "warning", cost: "$67.80" },
    { type: "Virtual Machines", count: 3, status: "healthy", cost: "$456.90" },
    { type: "Key Vaults", count: 2, status: "healthy", cost: "$12.40" },
    { type: "Function Apps", count: 5, status: "healthy", cost: "$34.60" },
    { type: "Container Instances", count: 7, status: "healthy", cost: "$123.80" },
  ])

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
        {/* Header - matching Azure connections style */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Azure Resource Manager
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Monitor and manage your Azure infrastructure with precision
            </p>
          </div>
        </div>

        {/* Stats cards - matching Azure connections style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "ACTIVE CONNECTIONS",
              count: activeConnections,
              icon: CheckCircle,
              bgColor: "bg-emerald-500",
              textColor: "text-white",
            },
            {
              label: "FAILED CONNECTIONS",
              count: failedConnections,
              icon: AlertCircle,
              bgColor: "bg-rose-500",
              textColor: "text-white",
            },
            {
              label: "TOTAL CONNECTIONS",
              count: azureConnections.length,
              icon: Database,
              bgColor: "bg-indigo-500",
              textColor: "text-white",
            },
            {
              label: "RUNNING JOBS",
              count: runningJobs,
              icon: Activity,
              bgColor: "bg-blue-500",
              textColor: "text-white",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} rounded-2xl p-4 shadow-sm`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Resource Overview - matching card style */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-indigo-500 rounded-lg p-2">
                <Server className="h-5 w-5 text-white" />
              </div>
              Resource Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {azureResources.map((resource, index) => (
                <div
                  key={index}
                  className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300 p-4 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${resource.status === "healthy"
                          ? "bg-emerald-500"
                          : resource.status === "warning"
                            ? "bg-orange-500"
                            : "bg-rose-500"
                          }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{resource.type}</p>
                        <p className="text-xs text-slate-500">{resource.count} instances</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{resource.cost}</p>
                      <p className="text-xs text-slate-500">monthly</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Cost Optimization Recommendations */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-emerald-500 rounded-lg p-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Cost Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {costOptimization.map((rec, index) => (
                <div
                  key={index}
                  className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300 p-5 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 leading-relaxed">{rec.recommendation}</h4>
                    <Badge
                      className={`text-xs font-semibold shadow-sm px-2.5 py-1 rounded-md ${rec.impact === "High"
                        ? "bg-emerald-100 text-emerald-800"
                        : rec.impact === "Medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-slate-100 text-slate-800"
                        }`}
                    >
                      {rec.impact}
                    </Badge>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">{rec.savings}/month</p>
                  <p className="text-xs text-slate-500 font-medium">Potential savings</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Azure Subscriptions - matching table style */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-blue-500 rounded-lg p-2">
                <Globe className="h-5 w-5 text-white" />
              </div>
              Azure Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    {["Connection", "Environment", "Status", "Last Validated", "Actions"].map((text) => (
                      <th
                        key={text}
                        className={`px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider ${text === "Actions" ? "text-right" : ""
                          }`}
                      >
                        {text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {azureConnections.map((connection) => (
                    <tr
                      key={connection.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {connection.status === "connected" ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-rose-500" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{connection.name}</div>
                            <div className="text-xs text-slate-500">
                              {connection.region} • {connection.resourceCount} resources
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border px-2.5 py-1 rounded-md text-xs font-medium">
                          Development
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${connection.status === "connected"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                            }`}
                        >
                          {connection.status === "connected" ? "Connected" : "Error"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">2025-08-14T07:18:29.745696</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-200/60 rounded-lg p-2">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>



        {/* Two column layout for Security and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="bg-rose-500 rounded-lg p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                Security Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {securityInsights.map((insight, index) => (
                <div
                  key={index}
                  className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300 p-4 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${insight.severity === "high"
                          ? "bg-rose-500"
                          : insight.severity === "medium"
                            ? "bg-orange-500"
                            : insight.severity === "low"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{insight.type}</p>
                        <p className="text-xs text-slate-500">{insight.description}</p>
                      </div>
                    </div>
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${insight.severity === "high" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-800"
                        }`}
                    >
                      {insight.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="bg-blue-500 rounded-lg p-2">
                  <Gauge className="h-5 w-5 text-white" />
                </div>
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{metric.value}%</span>
                      <Badge
                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${metric.status === "warning" ? "bg-red-100" : "bg-slate-100"
                          }`}
                      >
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={metric.value}
                    className={`h-2 ${metric.status === "warning" ? "bg-red-100" : "bg-slate-200"}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-emerald-500 rounded-lg p-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300 p-4 rounded-xl border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${activity.type === "success"
                      ? "bg-emerald-100"
                      : activity.type === "warning"
                        ? "bg-orange-100"
                        : activity.type === "error"
                          ? "bg-rose-100"
                          : "bg-blue-100"
                      }`}
                  >
                    {activity.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : activity.type === "warning" ? (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>


        {/* Active Deployments */}
        {runningJobs > 0 && (
          <Card className="overflow-hidden bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/50 p-6">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="bg-orange-500 rounded-lg p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Active Deployments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {deploymentJobs
                .filter((job) => job.status === "running")
                .map((job) => (
                  <div
                    key={job.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-300 p-5 rounded-2xl border border-slate-100"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100/80 rounded-xl shadow-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{job.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">Deploying {job.resources.join(", ")}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 font-semibold shadow-sm px-2.5 py-1 rounded-md text-xs">
                        {job.progress}%
                      </Badge>
                    </div>
                    <Progress value={job.progress} className="h-3 rounded-full" />
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Dashboard
