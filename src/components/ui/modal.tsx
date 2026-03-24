'use client'

import React, { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
  full: 'max-w-[95vw] max-h-[90vh]',
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  size = 'lg',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center'>
      {/* Overlay */}
      <div
        className={cn('bg-neo-black/40 animate-neo-fade-in absolute inset-0', overlayClassName)}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div
        className={cn(
          'animate-neo-pop border-neo border-neo-border bg-neo-card shadow-neo-xl relative z-10 w-full',
          sizeStyles[size],
          className,
        )}
        role='dialog'
        aria-modal='true'
      >
        {children}
      </div>
    </div>
  )
}

/* Subcomponents */
export function ModalHeader({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-b-neo border-neo-border flex items-center justify-between px-5 py-3.5',
        className,
      )}
    >
      <h2 className='text-neo-lg'>{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className='rounded-neo border-neo border-neo-border bg-neo-red shadow-neo-sm transition-neo duration-neo hover:shadow-neo active:shadow-neo-none flex h-8 w-8 cursor-pointer items-center justify-center text-white hover:-translate-x-px hover:-translate-y-px active:-translate-x-px active:-translate-y-px'
          aria-label='Kapat'
        >
          ✕
        </button>
      )}
    </div>
  )
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('p-5', className)}>{children}</div>
}
