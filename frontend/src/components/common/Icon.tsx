import { cn } from '../../utils/cn'

interface IconProps {
  name: string
  filled?: boolean
  className?: string
}

export function Icon({ name, filled = false, className }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined', filled && 'fill', className)}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
