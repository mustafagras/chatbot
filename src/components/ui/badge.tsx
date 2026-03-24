'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'notification' | 'online' | 'offline'

interface BadgeProps {
  variant?: BadgeVariant
  count?: number
  className?: string
  children?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neo-purple text-neo-black border-neo border-neo-border',
  notification: 'bg-neo-red text-white border-neo border-neo-border',
  online: 'bg-neo-mint border-neo border-neo-border',
  offline: 'bg-neo-gray-300 border-neo border-neo-border',
}

export default function Badge({ variant = 'default', count, className, children }: BadgeProps) {
  if (variant === 'notification' && count !== undefined && count <= 0) return null

  return (
    <span
      className={cn(
        'shadow-neo-sm inline-flex items-center justify-center font-bold',
        variant === 'notification' || variant === 'online' || variant === 'offline'
          ? 'h-5 min-w-5 rounded-full px-1 text-[10px]'
          : 'rounded-neo text-neo-xs px-2 py-0.5',
        variantStyles[variant],
        className,
      )}
    >
      {variant === 'notification' && count !== undefined ? (count > 99 ? '99+' : count) : children}
    </span>
  )
}
