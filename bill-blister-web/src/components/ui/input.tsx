import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  animated?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      animated = true,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()
    const hasError = !!error

    const inputClasses = cn(
      'form-input',
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon,
        'border-error focus:ring-error focus:border-error': hasError,
        'border-border focus:ring-navy focus:border-navy': !hasError,
      },
      className
    )

    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>
    )

    const content = (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        {animated ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {inputElement}
          </motion.div>
        ) : (
          inputElement
        )}
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-text-secondary mt-1">{helperText}</p>
        )}
      </div>
    )

    return content
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  animated?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      animated = true,
      ...props
    },
    ref
  ) => {
    const textareaId = React.useId()
    const hasError = !!error

    const textareaClasses = cn(
      'form-input min-h-[100px] resize-y',
      {
        'border-error focus:ring-error focus:border-error': hasError,
        'border-border focus:ring-navy focus:border-navy': !hasError,
      },
      className
    )

    const textareaElement = (
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
    )

    const content = (
      <div className="form-group">
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
          </label>
        )}
        {animated ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {textareaElement}
          </motion.div>
        ) : (
          textareaElement
        )}
        {error && <p className="form-error">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-text-secondary mt-1">{helperText}</p>
        )}
      </div>
    )

    return content
  }
)

Textarea.displayName = 'Textarea'

export { Input, Textarea }
export default Input