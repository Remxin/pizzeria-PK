import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ClientLayout } from './components/layout/ClientLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { ProtectedRoute } from './components/routing/ProtectedRoute'
import { MenuPage } from './pages/client/MenuPage'
import { PizzaCreatorPage } from './pages/client/PizzaCreatorPage'
import { CartPage } from './pages/client/CartPage'
import { LoginPage } from './pages/client/LoginPage'
import { RegisterPage } from './pages/client/RegisterPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { InventoryPage } from './pages/admin/InventoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — bez footera i bottom nav */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Client layout routes */}
        <Route element={<ClientLayout />}>
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="creator" element={<PizzaCreatorPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Admin layout routes */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
