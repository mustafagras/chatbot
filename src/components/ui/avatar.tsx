'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name: string
  color?: string
  size?: AvatarSize
  isOnline?: boolean
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-neo-xs',
  md: 'h-10 w-10 text-neo-sm',
  lg: 'h-14 w-14 text-neo-base',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({
  name,
  color = '#FFE66D',
  size = 'md',
  isOnline,
  className,
}: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'border-neo border-neo-border shadow-neo-sm flex items-center justify-center rounded-full font-bold',
          sizeStyles[size],
        )}
        style={{ backgroundColor: color }}
        title={name}
      >
        {getInitials(name)}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute -right-0.5 -bottom-0.5 block rounded-full border-2 border-white',
            size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
            isOnline ? 'bg-neo-mint' : 'bg-neo-gray-300',
          )}
        />
      )}
    </div>
  )
}
