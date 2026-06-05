import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ClientBottomNav } from './ClientBottomNav'

export function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ClientBottomNav />
    </div>
  )
}
