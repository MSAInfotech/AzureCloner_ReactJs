import { create } from "zustand"
import type { AzureConnection, AzureResource, DeploymentJob } from "@services/azureService"
import { azureService } from "@services/azureService"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

interface AppState {
  connections: AzureConnection[]
  connectionsWithDiscoverySessions: AzureConnection[]
  resources: AzureResource[]
  deploymentJobs: DeploymentJob[]
  selectedResources: string[]
  selectedSourceSessionId:string
  selectedSourceEnvId: string 
  isLoading: boolean
  error: string | null

  toasts: Toast[]
  showToast: (message: string, type: "success" | "error") => void
  removeToast: (id: string) => void

  // Actions
  setConnections: (connections: AzureConnection[]) => void
  addConnection: (connection: AzureConnection) => void
  removeConnection: (id: string) => void
  setResources: (resources: AzureResource[]) => void
  setSelectedResources: (resourceIds: string[]) => void
  addDeploymentJob: (job: DeploymentJob) => void
  updateDeploymentJob: (id: string, updates: Partial<DeploymentJob>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchConnections: () => Promise<void>
  getConnectionsWithDiscoverySessions: () => Promise<void>
  setSelectedSourceEnv:(envId: string,sessionId:string)=> void
}
let toastId = 0
export const useStore = create<AppState>((set) => ({
  connections: [],
  connectionsWithDiscoverySessions:[],
  resources: [],
  deploymentJobs: [],
  selectedResources: [],
  selectedSourceSessionId:"",
  selectedSourceEnvId: "", 
  isLoading: false,
  error: null,
  

  // ✅ Toast state
  toasts: [],
  showToast: (message, type) => {
    const id = (++toastId).toString()
    const toast = { id, message, type }

    set((state) => ({
      toasts: [...state.toasts, toast],
    }))

    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setConnections: (connections) => set({ connections }),
  fetchConnections: async () => {
    try {
      const data = await azureService.getAllConnections()
      set({ connections: data })
    } catch (err) {
      console.error("Failed to fetch connections", err)
    }
  },
  getConnectionsWithDiscoverySessions: async () => {
    try {
      const data = await azureService.getConnectionsWithDiscoverySessions()
      set({ connectionsWithDiscoverySessions: data })
    } catch (err) {
      console.error("Failed to fetch connections", err)
    }
  },
  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),
  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    })),
  setResources: (resources) => set({ resources }),
  setSelectedResources: (resourceIds) => set({ selectedResources: resourceIds }),
  addDeploymentJob: (job) =>
    set((state) => ({
      deploymentJobs: [...state.deploymentJobs, job],
    })),
  updateDeploymentJob: (id, updates) =>
    set((state) => ({
      deploymentJobs: state.deploymentJobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSelectedSourceEnv: (envId: string,sessionId:string) => set({ selectedSourceEnvId: envId,selectedSourceSessionId: sessionId })
}))
