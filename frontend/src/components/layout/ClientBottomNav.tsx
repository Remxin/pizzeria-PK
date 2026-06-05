import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Icon } from '../common/Icon'

const bottomNavItems = [
  { to: '/menu', label: 'Home', icon: 'home' },
  { to: '/creator', label: 'Builder', icon: 'local_pizza' },
  { to: '/cart', label: 'Koszyk', icon: 'shopping_cart' },
  { to: '/login', label: 'Profil', icon: 'person' },
]

export function ClientBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-md pb-md pt-sm bg-surface shadow-nav-bottom rounded-t-xl">
      {bottomNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-primary-container text-on-primary-container scale-95'
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
