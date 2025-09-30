'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Layout title="New Expense Claim" showActions={false}>
      <div className="max-w-4xl mx-auto">
        <motion.form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Basic Information */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Employee Name *</label>
                    <Input
                      type="text"
                      className={errors.employeeName ? 'border-red-500' : ''}
                      {...register('employeeName')}
                      placeholder="Enter employee name"
                    />
                    {errors.employeeName && (
                      <p className="text-sm text-red-600">{errors.employeeName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Expense Type *</label>
                    <select
                      className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${errors.expenseType ? 'border-red-500' : 'border-gray-200'}`}
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
                      <p className="text-sm text-red-600">{errors.expenseType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">LPO Number</label>
                    <Input
                      type="text"
                      {...register('lpoNumber')}
                      placeholder="Enter LPO number (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Bill Date *</label>
                    <Input
                      type="date"
                      className={errors.billDate ? 'border-red-500' : ''}
                      {...register('billDate')}
                    />
                    {errors.billDate && (
                      <p className="text-sm text-red-600">{errors.billDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Bill Amount (₹) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className={errors.billAmount ? 'border-red-500' : ''}
                      {...register('billAmount')}
                      placeholder="0.00"
                    />
                    {errors.billAmount && (
                      <p className="text-sm text-red-600">{errors.billAmount.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Notes</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 resize-none"
                    {...register('notes')}
                    placeholder="Additional notes or comments..."
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Receipt Attachments */}
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Receipt Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Upload receipt images or PDF files (Max 5 files)
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="outline" className="gap-2">
                      <label>
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
                    </Button>
                    
                    <Button asChild variant="outline" className="gap-2">
                      <label>
                        <PhotoIcon className="w-4 h-4" />
                        Choose from Gallery
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    
                    <Button asChild variant="outline" className="gap-2">
                      <label>
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
                    </Button>
                  </div>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Attached Files ({attachments.length}/5)
                    </h3>
                    {attachments.map((attachment, index) => (
                      <motion.div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
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
                        
                        <Button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-end"
            variants={cardVariants}
          >
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
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
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </Layout>
  );
};

export default NewExpenseClaimPage;