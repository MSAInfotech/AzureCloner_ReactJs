import { PublicClientApplication, type Configuration } from "@azure/msal-browser"

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "4c192127-7df6-48dc-b4e6-c362d1b1f19b",
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || "2cfb5d6e-b17f-45a3-8f91-aa88aa5dd115"}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)

export const loginRequest = {
  scopes: ["https://management.azure.com/user_impersonation"],//["https://management.azure.com/.default"],
}

export const acquireTokenSilent = async () => {
  const accounts = msalInstance.getAllAccounts()
  if (accounts.length > 0) {
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      return response.accessToken
    } catch (error) {
      console.error("Silent token acquisition failed:", error)
      throw error
    }
  }
  throw new Error("No accounts found")
}
