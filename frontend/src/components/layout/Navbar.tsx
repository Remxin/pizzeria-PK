import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Icon } from '../common/Icon'
import { BRAND_NAME } from '../../constants/mockData'

const clientNavLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/creator', label: 'Build Your Own' },
  { to: '/cart', label: 'Koszyk' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'font-label-lg text-label-lg transition-colors duration-200',
      isActive
        ? 'text-primary border-b-2 border-primary pb-1'
        : 'text-on-surface-variant hover:text-primary',
    )

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex sticky top-0 z-50 w-full justify-between items-center px-lg py-sm max-w-container-max mx-auto bg-surface shadow-nav-top">
        <Link to="/menu" className="font-headline-md text-headline-md font-bold text-primary">
          {BRAND_NAME}
        </Link>
        <div className="flex gap-lg">
          {clientNavLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex gap-md text-primary">
          <Link to="/login" aria-label="Konto">
            <Icon name="account_circle" className="cursor-pointer hover:opacity-80" />
          </Link>
        </div>
      </nav>

      {/* Mobile */}
      <header className="md:hidden flex justify-between items-center p-margin-mobile bg-surface sticky top-0 z-40 shadow-nav-top">
        <Link to="/menu" className="font-headline-sm text-headline-sm font-bold text-primary">
          {BRAND_NAME}
        </Link>
        <div className="flex gap-md text-primary items-center">
          <Link to="/cart" aria-label="Koszyk">
            <Icon name="shopping_cart" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu nawigacji"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-inverse-surface/40">
          <div className="absolute right-0 top-0 h-full w-72 bg-surface shadow-level-2 p-lg flex flex-col gap-md">
            <div className="flex justify-between items-center mb-md">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Zamknij menu"
              >
                <Icon name="close" />
              </button>
            </div>
            {clientNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'font-label-lg text-label-lg py-sm px-md rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-lg text-label-lg py-sm px-md rounded-lg text-on-surface-variant hover:bg-surface-container-high mt-auto"
            >
              Zaloguj się
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}
