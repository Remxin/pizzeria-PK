import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Icon } from '../common/Icon'

const adminBottomItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/inventory', label: 'Magazyn', icon: 'inventory_2' },
  { to: '/admin/dashboard', label: 'Zamówienia', icon: 'restaurant' },
  { to: '/menu', label: 'Sklep', icon: 'storefront' },
]

export function AdminBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-md pb-md pt-sm bg-surface shadow-nav-bottom rounded-t-xl">
      {adminBottomItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-secondary-container text-on-secondary-container scale-95'
                : 'text-on-surface-variant hover:text-primary',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={item.icon} filled={isActive} />
              <span className="font-label-sm text-label-sm mt-1">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
