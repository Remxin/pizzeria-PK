import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logoutAsync } from '../../features/auth/authSlice'
import { cn } from '../../utils/cn'
import { Icon } from '../common/Icon'
import { Button } from '../common/Button'
import { BRAND_NAME } from '../../constants/mockData'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'inventory_2' },
  { to: '/admin/dashboard', label: 'Orders', icon: 'restaurant' },
  { to: '/admin/dashboard', label: 'Kitchen', icon: 'oven_gen' },
]

export function AdminSidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutAsync())
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-md rounded-lg px-md py-sm w-full transition-all font-label-lg text-label-lg',
      isActive
        ? 'bg-secondary-container text-on-secondary-container'
        : 'text-on-surface-variant hover:bg-surface-container-high',
    )

  return (
    <aside className="hidden lg:flex flex-col h-screen sticky top-0 left-0 p-md border-r border-outline-variant bg-surface-container-low w-64 shrink-0">
      <div className="mb-xl px-sm">
        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
          {BRAND_NAME}
        </h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
          Main Street Branch
        </p>
      </div>

      <nav className="flex-1 space-y-sm">
        {adminNavItems.map((item) => (
          <NavLink key={item.label} to={item.to} className={linkClass}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-lg border-t border-outline-variant space-y-sm">
        {user && (
          <p className="font-label-sm text-label-sm text-on-surface-variant px-md">
            {user.fullName ?? user.email}
          </p>
        )}
        <Button
          variant="secondary"
          fullWidth
          leftIcon={<Icon name="logout" className="text-sm" />}
          onClick={handleLogout}
        >
          Wyloguj się
        </Button>
        <NavLink
          to="/menu"
          className="flex items-center gap-md text-on-surface-variant px-md py-sm hover:bg-surface-container-high transition-all rounded-lg w-full font-label-lg text-label-lg"
        >
          <Icon name="storefront" />
          <span>Back to Store</span>
        </NavLink>
      </div>
    </aside>
  )
}
