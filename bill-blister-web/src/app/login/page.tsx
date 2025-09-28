'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CurrencyDollarIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: yup.boolean(),
})

const LoginPage: React.FC = () => {
  const router = useRouter()
  const { login, setLoading } = useAuthStore()
  const { addToast } = useNotificationStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock user data - in real app, this would come from API
      const mockUser = {
        id: '1',
        email: data.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'ADMIN' as const,
        phone: '+1234567890',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockToken = 'mock-jwt-token'

      login(mockUser, mockToken)
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully logged in.',
      })

      router.push('/dashboard')
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid email or password. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-dark flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-onNavy/20 rounded-2xl mb-4">
            <CurrencyDollarIcon className="w-8 h-8 text-onNavy" />
          </div>
          <h1 className="text-3xl font-bold text-onNavy mb-2">Bill Blister</h1>
          <p className="text-onNavy-secondary">Expense Management System</p>
        </motion.div>

        {/* Login Form */}
        <motion.div variants={itemVariants}>
          <Card className="bg-surface/95 backdrop-blur-sm border-0 shadow-strong">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-text-primary">
                Welcome Back
              </CardTitle>
              <p className="text-text-secondary">
                Sign in to your account to continue
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />

                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      {...register('rememberMe')}
                      type="checkbox"
                      className="w-4 h-4 text-navy border-border rounded focus:ring-navy focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-text-secondary">
                      Remember me
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-navy hover:text-navy-light transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  className="h-12"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Don't have an account?{' '}
                  <Link
                    href="/signup"
                    className="text-navy hover:text-navy-light font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div variants={itemVariants} className="mt-6">
          <Card className="bg-onNavy/10 border border-onNavy/20">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-onNavy mb-2">Demo Credentials</h3>
              <div className="space-y-1 text-xs text-onNavy-secondary">
                <p><strong>Admin:</strong> admin@billblister.com / password123</p>
                <p><strong>Employee:</strong> employee@billblister.com / password123</p>
                <p><strong>Engineer:</strong> engineer@billblister.com / password123</p>
                <p><strong>HO Approver:</strong> approver@billblister.com / password123</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage
