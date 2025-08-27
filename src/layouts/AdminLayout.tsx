"use client"

import React from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { LayoutDashboard, Database, GitBranch, Settings, LogOut, Menu, Cloud, X } from "lucide-react"

type LayoutProps = {}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/admin/home", icon: LayoutDashboard },
    { name: "Connections", href: "/admin/Connections/Connection", icon: Database },
    { name: "Discovery", href: "/admin/discovery", icon: Settings },
    { name: "Deployments", href: "/admin/deployment", icon: GitBranch },
  ]

  const handleLogout = () => {
    // instance.logoutRedirect()
    // Add your logout logic here
    localStorage.removeItem("token") // or however you handle auth
    navigate("/login")
  }

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-2xl border-r border-slate-700/60 transform transition-all duration-300 ease-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100 transition-transform hover:scale-105">
              <Cloud onClick={() => navigate("/")} className="w-7 h-7 text-white cursor-pointer" />
            </div>
            <div>
              <h1
                onClick={() => navigate("/")}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-300 bg-clip-text text-transparent cursor-pointer hover:from-blue-300 hover:to-indigo-200 transition-all"
              >
                Azure Cloner
              </h1>
              <p className="text-sm text-slate-300 font-medium">Deployment Platform</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>
        <SidebarContent navigation={navigation} currentPath={location.pathname} onLogout={handleLogout} />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Top bar + Main content */}
      <div className="relative z-10">
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-sm border-b border-slate-200/60 flex items-center">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          {/* <div className="ml-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {navigation.find((nav) => nav.href === location.pathname)?.name ?? ""}
            </h1>
            <p className="text-sm text-slate-500 font-medium">Azure Resource Management</p>
          </div> */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer ml-4"
          >
            {/* Logo Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 
                  rounded-xl flex items-center justify-center shadow-md ring-2 ring-indigo-100 
                  transition-transform hover:scale-105">
              <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            {/* Logo Text */}
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
                 bg-clip-text text-transparent hover:from-blue-400 hover:to-indigo-400 transition-all 
                 whitespace-nowrap">
              Azure Cloner
            </h1>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-0">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

interface SidebarContentProps {
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }>
  currentPath: string
  onLogout: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, currentPath, onLogout }) => {
  return (
    <>
      <nav className="mt-8 space-y-2 px-4">
        {navigation.map((item) => {
          const isActive = currentPath === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-blue-300 border-l-4 border-blue-400 shadow-md"
                : "text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-indigo-500/20 hover:text-blue-200 hover:border-l-4 hover:border-blue-400"
                }`}
            >
              <div
                className={`mr-4 p-2 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-blue-600/30 text-blue-300"
                  : "bg-slate-700 text-slate-400 group-hover:bg-blue-600/30 group-hover:text-blue-200"
                  }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/60 bg-gradient-to-r from-slate-800/40 to-slate-900/40 p-4">
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-slate-200 hover:text-red-400 w-full px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 transition-all duration-200 font-medium"
        >
          <div className="mr-4 p-2 rounded-lg bg-slate-700 text-slate-300 group-hover:bg-red-600/30 group-hover:text-red-400 transition-all duration-200">
            <LogOut className="h-5 w-5" />
          </div>
          Sign out
        </button>
      </div>
    </>
  )
}

export default Layout
