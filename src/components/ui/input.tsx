'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type InputVariant = 'default' | 'error'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant
  label?: string
  error?: string
}

const variantStyles: Record<InputVariant, string> = {
  default:
    'border-neo border-neo-border shadow-neo focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-neo-lg',
  error:
    'border-neo border-neo-red shadow-[4px_4px_0px_0px_#FF6B6B] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_#FF6B6B]',
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const actualVariant = error ? 'error' : variant

    return (
      <div className='flex w-full flex-col gap-1.5'>
        {label && (
          <label htmlFor={inputId} className='text-neo-sm text-neo-black'>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'rounded-neo text-neo-base text-neo-black transition-neo duration-neo w-full bg-white px-4 py-3 outline-none',
            'placeholder:text-neo-gray-400 placeholder:font-normal',
            'disabled:pointer-events-none disabled:opacity-50',
            variantStyles[actualVariant],
            className,
          )}
          {...props}
        />
        {error && <p className='text-neo-xs text-neo-red'>{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
