import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-label-sm text-label-sm text-on-surface-variant mb-xs"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full bg-surface-container-low border-none rounded-lg p-sm',
            'font-body-md text-body-md text-on-surface',
            'focus:ring-2 focus:ring-primary focus:outline-none transition-shadow',
            'placeholder:text-on-surface-variant/60',
            leftIcon ? 'pl-10' : undefined,
            error && 'ring-2 ring-error',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-xs font-label-sm text-label-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">
          {helperText}
        </p>
      )}
    </div>
  )
}
