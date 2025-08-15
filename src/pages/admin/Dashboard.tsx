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
  Cloud,
  Server,
  Zap,
  TrendingUp,
  Globe,
  RefreshCw,
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
  const { connections, deploymentJobs, resources } = useStore()

  
  const [azureConnections] = useState([
    { id: 1, name: "Production Subscription", status: "connected", region: "East US", resourceCount: 24 },
    { id: 2, name: "Development Subscription", status: "connected", region: "West Europe", resourceCount: 12 },
    { id: 3, name: "Staging Subscription", status: "error", region: "Central US", resourceCount: 8 },
  ])
  const activeConnections = azureConnections.filter((c) => c.status === "connected").length
  const runningJobs = deploymentJobs.filter((j) => j.status === "running").length
  const completedJobs = deploymentJobs.filter((j) => j.status === "completed").length
  const totalResources = resources.length

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_50%,transparent_75%)]" />

      <div className="bg-gradient-to-r from-white/95 via-white/90 to-blue-50/95 backdrop-blur-2xl border-b border-slate-200/40 sticky top-0 z-10 shadow-lg shadow-slate-200/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl blur-lg opacity-30" />
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-4 rounded-3xl shadow-2xl shadow-blue-500/30 ring-1 ring-white/20">
                  <Cloud className="h-7 w-7 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
                  Azure Resource Manager
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-semibold tracking-wide">
                  Monitor and manage your Azure infrastructure with precision
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="outline"
                size="default"
                className="gap-3 bg-white/90 backdrop-blur-sm border-slate-300/50 hover:bg-white hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 shadow-md font-semibold text-slate-700 hover:text-blue-700 px-6 py-2.5 rounded-2xl"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh Data</span>
                <span className="sm:hidden">Refresh</span>
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Active Connections"
            value={activeConnections}
            icon={Shield}
            color="text-emerald-600"
            bgColor="bg-gradient-to-br from-emerald-50 to-teal-50"
          />
          <StatCard
            title="Total Resources"
            value={totalResources}
            icon={Database}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-50 to-indigo-50"
          />
          <StatCard
            title="Running Jobs"
            value={runningJobs}
            icon={Activity}
            color="text-amber-600"
            bgColor="bg-gradient-to-br from-amber-50 to-orange-50"
          />
          <StatCard
            title="Monthly Cost"
            value={activeConnections}
            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
        </div>

        {/* Azure Subscriptions
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Azure Subscriptions
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeConnections} Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${connection.status === "connected" ? "bg-emerald-100" : "bg-red-100"}`}
                  >
                    {connection.status === "connected" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={connection.status === "connected" ? "default" : "destructive"}>
                    {connection.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card> */}
        {/* Azure Subscriptions */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-bold text-slate-900">Azure Subscriptions</span>
              </CardTitle>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-sm opacity-20" />
                <Badge className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 px-4 py-2 rounded-2xl border-0 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {activeConnections} Connected
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {azureConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50/80 rounded-3xl border border-slate-200/60 gap-4 hover:bg-slate-100/80 hover:border-slate-300/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-2xl shadow-lg ${connection.status === "connected" ? "bg-gradient-to-br from-emerald-100 to-teal-100 shadow-emerald-500/20" : "bg-gradient-to-br from-red-100 to-rose-100 shadow-red-500/20"}`}
                  >
                    {connection.status === "connected" ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{connection.name}</h3>
                    <p className="text-sm text-slate-600 font-semibold">
                      {connection.region} • {connection.resourceCount} resources
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {connection.status === "connected" ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-sm opacity-20" />
                      <Badge className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/30 px-4 py-2 rounded-2xl border-0 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 capitalize">
                        <CheckCircle className="h-3 w-3 mr-2" />
                        Connected
                      </Badge>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl blur-sm opacity-20" />
                      <Badge className="relative bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold shadow-lg shadow-red-500/30 px-4 py-2 rounded-2xl border-0 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 capitalize">
                        <AlertCircle className="h-3 w-3 mr-2" />
                        Error
                      </Badge>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-slate-200/60 hover:shadow-md transition-all duration-300 rounded-2xl p-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resource Overview and Recent Activity
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-600" />
                Resource Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                   
                    <div>
                      <p className="font-medium text-slate-900">{resource.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">monthly</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

        {/* Resource Overview - Full Width */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Server className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="font-bold text-slate-900">Resource Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {azureResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 hover:bg-slate-100/80 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full shadow-sm ${resource.status === "healthy"
                        ? "bg-emerald-500 shadow-emerald-500/30"
                        : resource.status === "warning"
                          ? "bg-amber-500 shadow-amber-500/30"
                          : "bg-red-500 shadow-red-500/30"
                        }`}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{resource.type}</p>
                      <p className="text-sm text-slate-600 font-medium">{resource.count} instances</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{resource.cost}</p>
                    <p className="text-xs text-slate-500 font-medium">monthly</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${insight.severity === "high"
                        ? "bg-red-500"
                        : insight.severity === "medium"
                          ? "bg-amber-500"
                          : insight.severity === "low"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                    />
                    <div>
                      <p className="font-medium text-slate-900">{insight.type}</p>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  </div>
                  <Badge variant={insight.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                    {insight.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-blue-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{metric.value}%</span>
                      <Badge variant={metric.status === "warning" ? "destructive" : "secondary"} className="text-xs">
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


        {/* Recent Activity - Full Width */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-lg ${activity.type === "success"
                    ? "bg-emerald-100"
                    : activity.type === "warning"
                      ? "bg-amber-100"
                      : activity.type === "error"
                        ? "bg-red-100"
                        : "bg-blue-100"
                    }`}
                >

                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cost Optimization Recommendations */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-bold text-slate-900">Cost Optimization Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {costOptimization.map((rec, index) => (
                <div
                  key={index}
                  className="p-5 bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl border border-green-200/60 shadow-sm hover:shadow-md hover:border-green-300/60 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-sm leading-relaxed">{rec.recommendation}</h4>
                    <Badge
                      variant={rec.impact === "High" ? "default" : rec.impact === "Medium" ? "secondary" : "outline"}
                      className="text-xs font-semibold shadow-sm"
                    >
                      {rec.impact}
                    </Badge>
                  </div>
                  <p className="text-xl font-bold text-green-600">{rec.savings}/month</p>
                  <p className="text-xs text-slate-600 font-medium">Potential savings</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Deployments */}
        {runningJobs > 0 && (
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <span className="font-bold text-slate-900">Active Deployments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {deploymentJobs
                .filter((job) => job.status === "running")
                .map((job) => (
                  <div
                    key={job.id}
                    className="p-5 bg-gradient-to-br from-slate-50/80 to-blue-50/80 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100/80 rounded-xl shadow-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{job.name}</h3>
                          <p className="text-sm text-slate-600 font-medium">Deploying {job.resources.join(", ")}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100/80 text-blue-700 font-semibold shadow-sm">
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
    <Card
      className={`${bgColor} border-slate-200/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 backdrop-blur-xl`}
    ><CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg shadow-slate-200/50">
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-lg sm:text-2xl font-bold text-slate-900">{value}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default Dashboard
