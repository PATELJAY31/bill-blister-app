'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout from '@/components/layout/Layout';
import { expenseTypes } from '@/data/mockData';
import { ReceiptAttachment } from '@/types';
import { 
  DocumentTextIcon, 
  CameraIcon, 
  PhotoIcon, 
  XMarkIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

const schema = yup.object({
  employeeName: yup.string().required('Employee name is required'),
  expenseType: yup.string().required('Expense type is required'),
  lpoNumber: yup.string(),
  billDate: yup.string().required('Bill date is required'),
  billAmount: yup.number().positive('Amount must be positive').required('Bill amount is required'),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const NewExpenseClaimPage: React.FC = () => {
  const router = useRouter();
  const [attachments, setAttachments] = useState<ReceiptAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      employeeName: '',
      expenseType: '',
      lpoNumber: '',
      billDate: new Date().toISOString().split('T')[0],
      billAmount: 0,
      notes: '',
    },
  });

  const selectedExpenseType = watch('expenseType');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (attachments.length >= 5) {
        alert('Maximum 5 files allowed');
        return;
      }

      const attachment: ReceiptAttachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        path: URL.createObjectURL(file),
        mimeType: file.type,
        isImage: file.type.startsWith('image/'),
        file,
      };

      setAttachments(prev => [...prev, attachment]);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form data:', data);
      console.log('Attachments:', attachments);
      
      // Show success message
      alert('Expense claim submitted successfully!');
      
      // Navigate back to claims list
      router.push('/expense-claim');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="New Expense Claim" showActions={false}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-title text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Employee Name *</label>
                <input
                  type="text"
                  className={`form-input ${errors.employeeName ? 'border-error' : ''}`}
                  {...register('employeeName')}
                  placeholder="Enter employee name"
                />
                {errors.employeeName && (
                  <p className="form-error">{errors.employeeName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Expense Type *</label>
                <select
                  className={`form-input ${errors.expenseType ? 'border-error' : ''}`}
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

              <div className="form-group">
                <label className="form-label">LPO Number</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('lpoNumber')}
                  placeholder="Enter LPO number (optional)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bill Date *</label>
                <input
                  type="date"
                  className={`form-input ${errors.billDate ? 'border-error' : ''}`}
                  {...register('billDate')}
                />
                {errors.billDate && (
                  <p className="form-error">{errors.billDate.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Bill Amount (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.billAmount ? 'border-error' : ''}`}
                  {...register('billAmount')}
                  placeholder="0.00"
                />
                {errors.billAmount && (
                  <p className="form-error">{errors.billAmount.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input min-h-[100px] resize-none"
                {...register('notes')}
                placeholder="Additional notes or comments..."
              />
            </div>
          </div>

          {/* Receipt Attachments */}
          <div className="card">
            <h2 className="text-title text-gray-900 mb-6">Receipt Attachments</h2>
            
            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-body text-gray-600 mb-4">
                  Upload receipt images or PDF files (Max 5 files)
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <label className="btn btn-secondary cursor-pointer">
                    <CameraIcon className="w-4 h-4" />
                    Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="btn btn-secondary cursor-pointer">
                    <PhotoIcon className="w-4 h-4" />
                    Choose from Gallery
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="btn btn-secondary cursor-pointer">
                    <DocumentTextIcon className="w-4 h-4" />
                    Upload Files
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Attached Files ({attachments.length}/5)
                  </h3>
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {attachment.isImage ? (
                          <img
                            src={attachment.path}
                            alt={attachment.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <DocumentTextIcon className="w-10 h-10 text-gray-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.mimeType}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1 text-gray-400 hover:text-error transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Submit Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewExpenseClaimPage;