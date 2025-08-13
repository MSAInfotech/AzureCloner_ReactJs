"use client"

import React from "react"
import { Link, useLocation,useNavigate,Outlet } from "react-router-dom"
import { useMsal } from "@azure/msal-react"
import {
  LayoutDashboard,
  Database,
  GitBranch,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"

interface LayoutProps {
}

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
    { name: "Connections", href: "/admin/connection", icon: Database },
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
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 pt-4">
          <span className="text-xl font-semibold text-gray-900">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <SidebarContent
          navigation={navigation}
          currentPath={location.pathname}
          onLogout={handleLogout}
        />
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top bar + Main content */}
      <div className="relative z-10">
        <div className="sticky top-0 z-30 bg-white px-4 py-3 shadow-sm flex items-center">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-indigo-700">
            {navigation.find((nav) => nav.href === location.pathname)?.name ?? ""}
          </h1>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8"><Outlet /></div>
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
  const navigate = useNavigate()
  return (
    <>
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center px-4">
          <div onClick={() => navigate("/")} className="text-2xl font-bold text-blue-700">Azure Cloner</div>
        </div>
        <nav className="mt-6 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-150 border-l-4 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 border-indigo-600"
                    : "text-gray-600 hover:bg-sky-50 hover:text-sky-800 border-transparent"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-sky-600"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-gray-600 hover:text-red-600 w-full"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </>
  )
}

export default Layout
