import { ResourceManagementClient } from "@azure/arm-resources"
import { ClientSecretCredential, DefaultAzureCredential } from "@azure/identity"
const baseUrl = process.env.REACT_APP_API_BASE_URL

export interface AzureConnection {
  id: string
  name: string
  subscriptionId: string
  tenantId: string
  clientId?: string
  clientSecret?: string
  environment: string
  status: "connected" | "disconnected" | "error"
  lastValidated: Date
  latestSessionId: string
}

export interface AzureResource {
  id: string
  name: string
  type: string
  resourceGroup: string
  location: string
  tags: Record<string, string>
  properties: any
  dependencies: string[]
}

export interface DeploymentJob {
  id: string
  name: string
  sourceDiscoverySessionId: string
  targetConnectionId: string
  resources: AzureResource[]
  status: "pending" | "running" | "completed" | "failed" | "paused"
  progress: number
  startTime?: Date
  endTime?: Date
  errorMessage?: string
}
export interface DiscoveryResult {
  session: DiscoverySession
  discoveredResources: AzureResource[]
}

export interface DiscoverySession {
  id: string
  name: string
  sourceSubscriptionId: string
  targetSubscriptionId: string
  resourceGroupFilters: string[]
  resourceTypeFilters: string[]
  status: "InProgress" | "Completed" | "Failed"
  completedAt?: string
  errorMessage?: string
}

class AzureService {
  private connections: Map<string, AzureConnection> = new Map()
  private resourceClients: Map<string, ResourceManagementClient> = new Map()

  //Create and validate
  async validateAzureConnectionInline(
    connection: Omit<AzureConnection, "id" | "status" | "lastValidated">
  ): Promise<{ message: string }> {
    const response = await fetch(`${baseUrl}/api/connection/validate-azure-connection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(connection),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Validation failed");
    }

    return data;
  }

  async createConnection(
    connection: Omit<AzureConnection, "id" | "status" | "lastValidated">,
  ): Promise<AzureConnection> {
    const newConnection: AzureConnection = {
      ...connection,
      id: crypto.randomUUID(),
      status: "disconnected",
      lastValidated: new Date(),
    }

    try {
      await this.validateConnection(newConnection)
      newConnection.status = "connected"
      this.connections.set(newConnection.id, newConnection)
      return newConnection
    } catch (error) {
      newConnection.status = "error"
      this.connections.set(newConnection.id, newConnection)
      throw error
    }
  }

  async validateConnection(connection: AzureConnection): Promise<boolean> {
    try {
      const credential =
        connection.clientId && connection.clientSecret
          ? new ClientSecretCredential(connection.tenantId, connection.clientId, connection.clientSecret)
          : new DefaultAzureCredential()

      const resourceClient = new ResourceManagementClient(credential, connection.subscriptionId)

      // Test the connection by listing resource groups
      const resourceGroups = resourceClient.resourceGroups.list()
      await resourceGroups.next()

      this.resourceClients.set(connection.id, resourceClient)

      // Update connection status
      connection.status = "connected"
      connection.lastValidated = new Date()
      this.connections.set(connection.id, connection)

      return true
    } catch (error) {
      console.error("Connection validation failed:", error)
      connection.status = "error"
      this.connections.set(connection.id, connection)
      throw error
    }
  }

  async startDiscoverySession(subscriptionId: string, connectionId: string): Promise<any> {
    const request = {
      sourceSubscriptionId: subscriptionId,
      connectionId: connectionId
    }

    const response = await fetch(`${baseUrl}/api/discovery/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.error || "Failed to start discovery session")
    }

    return data as DiscoveryResult // session object
  }

  async discoverResources(connectionId: string): Promise<AzureResource[]> {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error("Connection not found")
    }

    const resourceClient = this.resourceClients.get(connectionId)
    if (!resourceClient) {
      throw new Error("Resource client not initialized")
    }

    try {
      const resources: AzureResource[] = []

      // Get all resources in the subscription
      const resourceList = resourceClient.resources.list()

      for await (const resource of resourceList) {
        if (resource.id && resource.name && resource.type && resource.location) {
          const azureResource: AzureResource = {
            id: resource.id,
            name: resource.name,
            type: resource.type,
            resourceGroup: this.extractResourceGroup(resource.id),
            location: resource.location,
            tags: resource.tags || {},
            properties: resource.properties || {},
            dependencies: await this.analyzeDependencies(resource.id, resourceClient),
          }
          resources.push(azureResource)
        }
      }

      return resources
    } catch (error) {
      console.error("Resource discovery failed:", error)
      throw error
    }
  }

  private extractResourceGroup(resourceId: string): string {
    const match = resourceId.match(/\/resourceGroups\/([^/]+)/)
    return match ? match[1] : "Unknown"
  }

  private async analyzeDependencies(resourceId: string, resourceClient: ResourceManagementClient): Promise<string[]> {
    try {
      // This is a simplified dependency analysis
      // In a real implementation, you would analyze the resource properties
      // to find references to other resources
      return []
    } catch (error) {
      console.error("Dependency analysis failed:", error)
      return []
    }
  }

  async createDeploymentTemplate(resources: AzureResource[]): Promise<any> {
    // Generate ARM template from selected resources
    const template = {
      $schema: "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      contentVersion: "1.0.0.0",
      parameters: {},
      variables: {},
      resources: resources.map((resource) => ({
        type: resource.type,
        apiVersion: this.getApiVersion(resource.type),
        name: resource.name,
        location: resource.location,
        tags: resource.tags,
        properties: resource.properties,
      })),
      outputs: {},
    }

    return template
  }

  private getApiVersion(resourceType: string): string {
    // Return appropriate API version based on resource type
    const apiVersions: Record<string, string> = {
      "Microsoft.Compute/virtualMachines": "2023-03-01",
      "Microsoft.Storage/storageAccounts": "2023-01-01",
      "Microsoft.Sql/servers": "2022-05-01-preview",
      "Microsoft.Web/sites": "2022-09-01",
      "Microsoft.Network/virtualNetworks": "2023-02-01",
    }

    return apiVersions[resourceType] || "2023-01-01"
  }

  async deployResources(
    sourceDiscoverySessionId: string,
    targetConnectionId: string,
    resources: AzureResource[],
    deploymentName: string,
  ): Promise<DeploymentJob> {
    const deploymentJob: DeploymentJob = {
      id: crypto.randomUUID(),
      name: deploymentName,
      sourceDiscoverySessionId,
      targetConnectionId,
      resources,
      status: "pending",
      progress: 0,
      startTime: new Date(),
    }

    try {
      deploymentJob.status = "running"
      // Create deployment request payload
      const deploymentRequest = {
        deploymentName,
        DiscoverySessionId: sourceDiscoverySessionId,
        targetSubscriptionId: targetConnectionId,
        targetResourceGroup: resources.toString(),
        mode: 0, // or "Complete" if needed
        validateOnly: false,         // Required by backend model
        parameters: {}
      };

      const response = await fetch(`${baseUrl}/api/deployment/start-deployment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(deploymentRequest)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.Error || data?.message || "Failed to create deployment session";
        throw new Error(errorMsg);
      }

      deploymentJob.status = "completed"
      deploymentJob.endTime = new Date()
      deploymentJob.progress = 100

      return deploymentJob
    } catch (error) {
      deploymentJob.status = "failed"
      deploymentJob.errorMessage = error instanceof Error ? error.message : "Unknown error"
      deploymentJob.endTime = new Date()
      throw error
    }
  }

  async getAllConnections(): Promise<AzureConnection[]> {
    try {
      const response = await fetch(`${baseUrl}/api/connection/connections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data.data || [];
      } else {
        console.error("Error fetching connections:", data.errors);
        throw new Error(data.message || "Failed to fetch connections");
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw new Error("An error occurred while fetching connections");
    }
  }

  async getConnectionsWithDiscoverySessions(): Promise<AzureConnection[]> {
    try {
      const response = await fetch(`${baseUrl}/api/connection/connectionsWithDiscovery`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data.data || [];
      } else {
        console.error("Error fetching connections:", data.errors);
        throw new Error(data.message || "Failed to fetch connections");
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      throw new Error("An error occurred while fetching connections");
    }
  }

  getConnection(id: string): AzureConnection | undefined {
    return this.connections.get(id)
  }

  async deleteConnection(id: string): Promise<void> {
    try {
      const response = await fetch(`${baseUrl}/api/connection/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to delete connection:", data.errors);
        throw new Error(data.message || "Failed to delete connection");
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
      throw new Error("An error occurred while deleting the connection.");
    }
    // this.connections.delete(id)
    // this.resourceClients.delete(id)
  }
}

export const azureService = new AzureService()
