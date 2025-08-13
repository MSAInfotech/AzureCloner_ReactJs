import React from 'react';
// import { Toaster } from 'react-hot-toast';
import { useStore } from "@store/useStore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Public-facing screens
import Home from "./pages/users/Home";
import AzureClone from './pages/users/products/AzureClone';
import BackupManager from './pages/users/products/BackupManager';
import ServiceSync from './pages/users/products/ServiceSync';
import Migration from './pages/users/solutions/Migration';
import Governance from './pages/users/solutions/Governance';
import Resources from './pages/users/Resources';
import Pricing from './pages/users/Pricing';
import Partners from './pages/users/Partners';
import Signup from './pages/users/Signup';
import ForgotPassword from './pages/users/ForgotPassword';
import ResetPassword from './pages/users/ResetPassword';
import Login from './pages/users/Login';
import MainLayout from "./layouts/MainLayout";
//Dashboard
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from './pages/admin/Dashboard';
import Deployment from './pages/admin/Deployments';
import Connection from './pages/admin/Connections';
import ResourceDiscovery from './pages/admin/ResourceDiscovery';
import PrivateRoute from './components/users/PrivateRoute';

function Toasts() {
  const { toasts, removeToast } = useStore()

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded px-4 py-2 shadow-lg text-white text-sm ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="flex justify-between items-center space-x-2">
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-white font-bold">×</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Router>
     <Toasts />
      <Routes>
        {/* Public routes with layout */}
        <Route element={<MainLayout />}>
          {/* Public-facing screens*/}
          <Route path="/" element={<Home />} />
          <Route path="/products/azure-clone" element={<AzureClone />} />
          <Route path="/products/backup-manager" element={<BackupManager />} />
          <Route path="/products/service-sync" element={<ServiceSync />} />
          <Route path="/solutions/migration" element={<Migration />} />
          <Route path="/solutions/governance" element={<Governance />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          {/* Add more routes here that require Header/Footer */}
        </Route>
        {/* Protected Dashboard */}
        <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route path="/admin/home" element={<DashboardHome />} />
          <Route path="/admin/deployment" element={<Deployment />} />
          <Route path="/admin/discovery" element={<ResourceDiscovery />} />
          <Route path="/admin/connection" element={<Connection />} />
        </Route>

        {/* Routes WITHOUT layout */}
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
