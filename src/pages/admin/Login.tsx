"use client"

import type React from "react"
import { useMsal } from "@azure/msal-react"
// import { loginRequest } from "@services/authService"
import { Cloud, Shield, Database, GitBranch } from "lucide-react"

const Login: React.FC = () => {
  const { instance } = useMsal()

  const handleLogin = () => {
    // instance.loginRedirect(loginRequest)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Cloud className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Azure Resource Cloner</h2>
          <p className="mt-2 text-sm text-gray-600">Clone and deploy Azure resources across environments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Database className="h-4 w-4 text-green-500" />
                <span>Resource Discovery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GitBranch className="h-4 w-4 text-purple-500" />
                <span>Automated Deployment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Cloud className="h-4 w-4 text-orange-500" />
                <span>Multi-Environment</span>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Sign in with Microsoft
            </button>

            <div className="text-xs text-gray-500 text-center">
              By signing in, you agree to access Azure resources through this application. Your credentials are handled
              securely by Microsoft Azure AD.
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Need help? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
