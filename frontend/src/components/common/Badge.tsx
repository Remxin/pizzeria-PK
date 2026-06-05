import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface-variant border-outline-variant',
  primary: 'bg-primary-container text-on-primary-container border-primary/20',
  secondary: 'bg-secondary-fixed text-on-secondary-fixed border-secondary/20',
  success: 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20',
  error: 'bg-error-container text-on-error-container border-error/20',
  warning: 'bg-secondary-container text-on-secondary-container border-secondary/20',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-sm py-xs rounded-full font-label-sm text-label-sm border',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
