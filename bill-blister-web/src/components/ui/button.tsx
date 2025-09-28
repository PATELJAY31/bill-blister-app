import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  animated?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      animated = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-success': variant === 'success',
        'btn-warning': variant === 'warning',
        'btn-error': variant === 'error',
        'bg-transparent hover:bg-surface-tertiary text-text-primary': variant === 'ghost',
        'btn-sm': size === 'sm',
        'btn-md': size === 'md',
        'btn-lg': size === 'lg',
        'w-full': fullWidth,
        'opacity-50 cursor-not-allowed': disabled || loading,
      },
      className
    )

    const content = (
      <>
        {loading && (
          <div className="loading-spinner w-4 h-4 mr-2" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    )

    if (!animated) {
      return (
        <button
          ref={ref}
          className={baseClasses}
          disabled={disabled || loading}
          {...props}
        >
          {content}
        </button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button