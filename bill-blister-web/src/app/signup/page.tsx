'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notifications'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { UserRole } from '@/types'

// Validation schema
const signupSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['EMPLOYEE', 'ENGINEER', 'HO_APPROVER', 'ADMIN'], 'Please select a valid role').required('Role is required'),
  phone: yup.string().optional().matches(
    /^[\+]?[1-9][\d]{0,15}$/,
    'Please enter a valid phone number'
  ),
  reportingManagerId: yup.number().optional(),
})

type SignupFormData = yup.InferType<typeof signupSchema>

// Role options
const roleOptions = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'ENGINEER', label: 'Engineer' },
  { value: 'HO_APPROVER', label: 'HO Approver' },
  { value: 'ADMIN', label: 'Admin' },
]

// Reporting manager options (mock data - in real app, this would come from API)
const reportingManagerOptions = [
  { value: '', label: 'Select Reporting Manager (Optional)' },
  { value: '1', label: 'Admin User' },
  { value: '2', label: 'John Doe' },
  { value: '3', label: 'Jane Smith' },
  { value: '4', label: 'Mike Johnson' },
]

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuthStore()
  const { addNotification } = useNotificationStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      role: 'EMPLOYEE',
    },
  })

  const selectedRole = watch('role')
  const password = watch('password')
  
  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    const strengthMap = {
      0: { label: '', color: '' },
      1: { label: 'Very Weak', color: 'bg-red-500' },
      2: { label: 'Weak', color: 'bg-orange-500' },
      3: { label: 'Fair', color: 'bg-yellow-500' },
      4: { label: 'Good', color: 'bg-blue-500' },
      5: { label: 'Strong', color: 'bg-green-500' },
    }
    
    return { strength, ...strengthMap[strength as keyof typeof strengthMap] }
  }
  
  const passwordStrength = getPasswordStrength(password || '')

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        reportingManagerId: data.reportingManagerId ? parseInt(data.reportingManagerId.toString()) : undefined,
      })
      
      addNotification({
        id: Date.now().toString(),
        title: 'Account Created',
        message: 'Your account has been created successfully!',
        type: 'SUCCESS',
        isRead: false,
        createdAt: new Date(),
      })
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
      addNotification({
        id: Date.now().toString(),
        title: 'Signup Failed',
        message: err.message || 'Failed to create account. Please try again.',
        type: 'ERROR',
        isRead: false,
        createdAt: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4"
            >
              <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Join Bill Blister to manage your expenses
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    icon={<UserIcon className="w-5 h-5" />}
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    icon={<UserIcon className="w-5 h-5" />}
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    required
                  />
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="Enter phone number"
                  icon={<PhoneIcon className="w-5 h-5" />}
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </motion.div>

              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  options={roleOptions}
                  placeholder="Select your role"
                  {...register('role')}
                  error={errors.role?.message}
                />
                {selectedRole && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500 mt-1"
                  >
                    {selectedRole === 'ADMIN' && 'Full system access and management capabilities'}
                    {selectedRole === 'HO_APPROVER' && 'Can approve expense claims after verification'}
                    {selectedRole === 'ENGINEER' && 'Can verify expense claims before approval'}
                    {selectedRole === 'EMPLOYEE' && 'Can submit expense claims and view own data'}
                  </motion.p>
                )}
              </motion.div>

              {/* Reporting Manager */}
              {selectedRole !== 'ADMIN' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Manager (Optional)
                  </label>
                  <Select
                    options={reportingManagerOptions}
                    placeholder="Select reporting manager"
                    {...register('reportingManagerId')}
                    error={errors.reportingManagerId?.message}
                  />
                </motion.div>
              )}

              {/* Password Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                  {...register('password')}
                  error={errors.password?.message}
                  required
                />
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 min-w-0">
                        {passwordStrength.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  icon={<LockClosedIcon className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>

              {/* Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-center pt-4"
              >
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
