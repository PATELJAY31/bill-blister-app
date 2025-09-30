'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import InfoRow from '@/components/ui/InfoRow';
import EmptyState from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { mockAllocations, getTotalCashIssued, getFilteredAllocations } from '@/data/mockData';
import { Allocation } from '@/types';
import { CurrencyDollarIcon, UserIcon, CalendarIcon, DocumentTextIcon, FunnelIcon } from '@heroicons/react/24/outline';

const AmountAllocationPage: React.FC = () => {
  const [allocations] = useState<Allocation[]>(mockAllocations);
  const [filters, setFilters] = useState({
    employeeName: '',
    expenseType: '',
  });

  const filteredAllocations = getFilteredAllocations(filters);
  const totalCashIssued = getTotalCashIssued();

  const handleAllocationClick = (allocation: Allocation) => {
    console.log('Allocation clicked:', allocation);
    // TODO: Navigate to allocation details or edit
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

  if (filteredAllocations.length === 0) {
    return (
      <Layout title="Amount Allocation">
        <EmptyState
          title="No Allocations Found"
          description="There are no cash allocations matching your current filters."
          actionText="Add New Allocation"
          onAction={() => console.log('Add allocation clicked')}
          secondaryActionText="Clear Filters"
          onSecondaryAction={() => setFilters({ employeeName: '', expenseType: '' })}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Amount Allocation">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Cash Issued</p>
                    <p className="text-3xl font-bold text-gray-900">₹{totalCashIssued.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Across {allocations.length} allocation{allocations.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Active Allocations</p>
                    <p className="text-3xl font-bold text-gray-900">{filteredAllocations.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Currently showing
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Employee Name</label>
                  <Input
                    placeholder="Search by employee name..."
                    value={filters.employeeName}
                    onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Expense Type</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    value={filters.expenseType}
                    onChange={(e) => setFilters({ ...filters, expenseType: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Supplies">Supplies</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Allocations List */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <CardTitle>
                Allocations ({filteredAllocations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {filteredAllocations.map((allocation, index) => (
                  <motion.div
                    key={allocation.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleAllocationClick(allocation)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <InfoRow
                      label={allocation.employeeName}
                      value={`₹${allocation.cashIssued.toFixed(2)}`}
                      icon={<UserIcon className="w-5 h-5" />}
                      delay={index}
                    />
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <DocumentTextIcon className="w-4 h-4" />
                            {allocation.expenseType}
                          </span>
                          {allocation.lpoNumber && (
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {allocation.lpoNumber}
                            </span>
                          )}
                        </div>
                        <span>
                          {new Date(allocation.allocationDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AmountAllocationPage;
