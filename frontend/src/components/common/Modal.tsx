import { useEffect, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Icon } from './Icon'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-margin-mobile"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 bg-inverse-surface/40"
        onClick={onClose}
        aria-label="Zamknij modal"
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg bg-surface rounded-xl shadow-level-2 p-lg',
          className,
        )}
      >
        <div className="flex items-center justify-between mb-md">
          {title && (
            <h2 id="modal-title" className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Zamknij"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
