import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type CardElevation = 'flat' | 'level-1' | 'level-2'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

const elevationClasses: Record<CardElevation, string> = {
  flat: '',
  'level-1': 'shadow-level-1',
  'level-2': 'shadow-level-2',
}

const paddingClasses = {
  none: '',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg md:p-lg',
}

export function Card({
  elevation = 'level-1',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-xl border border-surface-variant',
        elevationClasses[elevation],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
