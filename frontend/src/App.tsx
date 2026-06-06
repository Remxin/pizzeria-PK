import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ClientLayout } from './components/layout/ClientLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { useAuthInit } from './hooks/useAuthInit'
import { useOrderSocket } from './hooks/useOrderSocket'
import { MenuPage } from './pages/client/MenuPage'
import { PizzaCreatorPage } from './pages/client/PizzaCreatorPage'
import { CartPage } from './pages/client/CartPage'
import { LoginPage } from './pages/client/LoginPage'
import { RegisterPage } from './pages/client/RegisterPage'
import { OrderTrackingPage } from './pages/client/OrderTrackingPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { InventoryPage } from './pages/admin/InventoryPage'

function AppRoutes() {
  const { isInitialized, loading } = useAuthInit()
  useOrderSocket()

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-md">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ładowanie aplikacji...
          </p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ClientLayout />}>
        <Route index element={<Navigate to="/menu" replace />} />
        <Route path="menu" element={<MenuPage />} />
        <Route
          path="creator"
          element={
            <ProtectedRoute requireAuth>
              <PizzaCreatorPage />
            </ProtectedRoute>
          }
        />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders/:id" element={<OrderTrackingPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
