'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/layout/Layout';
import { expenseTypesAPI } from '@/lib/api';
import { CheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  employeeName: yup.string().required('Employee name is required'),
  expenseType: yup.string().required('Expense type is required'),
  lpoNumber: yup.string(),
  cashIssued: yup.number().positive('Amount must be positive').required('Cash amount is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const AddAllocationPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      employeeName: '',
      expenseType: '',
      lpoNumber: '',
      cashIssued: 0,
      notes: '',
    },
  });

  const selectedExpenseType = watch('expenseType');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Allocation data:', data);
      
      // Show success message
      alert('Cash allocation added successfully!');
      
      // Navigate back to allocations list
      router.push('/amount-allocation');
    } catch (error) {
      console.error('Error adding allocation:', error);
      alert('Error adding allocation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Add Cash Allocation" showActions={false}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-status-success-light rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-status-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-primary">New Cash Allocation</h2>
                <p className="text-text-secondary">Allocate cash to an employee for expense claims</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Allocation Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Employee Name *</label>
                <input
                  type="text"
                  className={`form-input ${errors.employeeName ? 'border-status-error' : ''}`}
                  {...register('employeeName')}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && (
                  <p className="form-error">{errors.employeeName.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Expense Type *</label>
                <select
                  className={`form-input ${errors.expenseType ? 'border-status-error' : ''}`}
                  {...register('expenseType')}
                >
                  <option value="">Select expense type</option>
                  {expenseTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
                {errors.expenseType && (
                  <p className="form-error">{errors.expenseType.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">LPO Number</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('lpoNumber')}
                  placeholder="Enter LPO number (optional)"
                />
                <p className="text-xs text-text-tertiary mt-1">
                  Local Purchase Order number for tracking
                </p>
              </div>

              <div>
                <label className="form-label">Cash Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.cashIssued ? 'border-status-error' : ''}`}
                  {...register('cashIssued')}
                  placeholder="0.00"
                />
                {errors.cashIssued && (
                  <p className="form-error">{errors.cashIssued.message}</p>
                )}
                <p className="text-xs text-text-tertiary mt-1">
                  Amount of cash to be allocated
                </p>
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input min-h-[80px] resize-none"
                  {...register('notes')}
                  placeholder="Additional notes or comments about this allocation..."
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedExpenseType && (
            <div className="card bg-surface-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-2">Allocation Summary</h3>
              <div className="text-sm text-text-secondary space-y-1">
                <p><span className="font-medium">Type:</span> {selectedExpenseType}</p>
                <p><span className="font-medium">Status:</span> Active</p>
                <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Allocation...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Add Allocation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddAllocationPage;
