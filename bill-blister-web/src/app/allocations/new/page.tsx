'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/Select';
import { 
  PlusIcon, 
  XMarkIcon, 
  DocumentIcon,
  PhotoIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useNotificationStore } from '@/store/notifications';
import { allocationsAPI } from '@/lib/api';

interface Attachment {
  id: string;
  name: string;
  file: File;
  type: 'image' | 'document';
}

interface FormData {
  allocationDate: string;
  expenseType: string;
  amount: string;
  remarks: string;
  billNumber: string;
  billDate: string;
  notes: string;
  originalBill: boolean;
}

const NewAllocationPage: React.FC = () => {
  const router = useRouter();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();

  const expenseTypes = [
    'Food',
    'Travel',
    'Office Supplies',
    'Conference & Trade Show Registration',
    'Accommodation',
    'Transportation',
    'Entertainment',
    'Other'
  ];

  const addAttachment = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file: file,
        type: file.type.startsWith('image/') ? 'image' : 'document'
      };
      setAttachments(prev => [...prev, attachment]);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const { addToast } = useNotificationStore();
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Call the API to create a new allocation
      const allocationData = {
        ...data,
        fileUrl: attachments.length > 0 ? attachments[0].url : null,
      };
      
      await allocationsAPI.create(allocationData);
      
      addToast({
        type: 'success',
        title: 'Success',
        message: 'Allocation created successfully!',
      });
      
      // Navigate back to allocations list
      router.push('/allocations');
    } catch (error) {
      console.error('Error creating allocation:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error creating allocation. Please try again.',
      });
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
    <Layout title="New Allocation" showActions={false}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Create New Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Allocation Date and Expense Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allocation Date *
                    </label>
                    <Input
                      type="date"
                      {...register('allocationDate', { required: 'Allocation date is required' })}
                    />
                    {errors.allocationDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.allocationDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expense Type *
                    </label>
                    <Select
                      options={expenseTypes.map(type => ({ value: type, label: type }))}
                      value={watch('expenseType') || ''}
                      onChange={(e) => setValue('expenseType', e.target.value)}
                      placeholder="Select expense type"
                    />
                    {errors.expenseType && (
                      <p className="text-red-500 text-sm mt-1">{errors.expenseType.message}</p>
                    )}
                  </div>
                </div>

                {/* Amount and Bill Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Amount must be greater than 0' }
                      })}
                      placeholder="0.00"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bill Number
                    </label>
                    <Input
                      {...register('billNumber')}
                      placeholder="Enter bill number"
                    />
                  </div>
                </div>

                {/* Bill Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bill Date
                  </label>
                  <Input
                    type="date"
                    {...register('billDate')}
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <Textarea
                    {...register('remarks')}
                    placeholder="Enter remarks..."
                    rows={3}
                  />
                </div>

                {/* Receipt Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt Attachments
                  </label>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => addAttachment(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload receipts or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB each
                      </span>
                    </label>
                  </div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                      {attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {attachment.type === 'image' ? (
                              <PhotoIcon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <DocumentIcon className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-700">{attachment.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <Textarea
                    {...register('notes')}
                    placeholder="Add any additional notes..."
                    rows={4}
                  />
                </div>

                {/* Original Bill Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('originalBill')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Original bill provided
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Allocation'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default NewAllocationPage;
