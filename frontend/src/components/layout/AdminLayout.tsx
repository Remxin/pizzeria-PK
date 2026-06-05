import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminBottomNav } from './AdminBottomNav'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background font-body-md text-on-background pb-24 lg:pb-0">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
      <AdminBottomNav />
    </div>
  )
}
