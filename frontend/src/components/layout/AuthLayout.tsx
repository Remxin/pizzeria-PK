import { Link, Outlet } from 'react-router-dom'
import { BRAND_NAME } from '../../constants/mockData'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-dim">
      <header className="flex items-center justify-center p-md bg-surface shadow-nav-top">
        <Link
          to="/menu"
          className="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity"
        >
          {BRAND_NAME}
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
