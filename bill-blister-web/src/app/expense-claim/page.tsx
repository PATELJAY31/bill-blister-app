'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { claimsAPI } from '@/lib/api';
import { Claim } from '@/types';
import { DocumentTextIcon, PlusIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ExpenseClaimPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  // Load claims from API
  React.useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        const response = await claimsAPI.getAll();
        setClaims(response.data.data || []);
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(claim => claim.engineerStatus === filter);

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
    return claims.filter(claim => claim.engineerStatus === status).length;
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

  if (claims.length === 0) {
    return (
      <Layout title="Expense Claims">
        <EmptyState
          title="No Claims Found"
          description="You haven't submitted any expense claims yet."
          actionText="Create New Claim"
          onAction={() => window.location.href = '/expense-claim/new'}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Expense Claims">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">Total Claims</p>
                    <p className="text-3xl font-bold text-navy">{claims.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">Pending</p>
                    <p className="text-3xl font-bold text-warning">{getStatusCount('pending')}</p>
                  </div>
                  <StatusChip status="pending" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-1">Approved</p>
                    <p className="text-3xl font-bold text-success">{getStatusCount('approved')}</p>
                  </div>
                  <StatusChip status="approved" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { key: 'all', label: 'All Claims', count: claims.length },
                  { key: 'pending', label: 'Pending', count: getStatusCount('pending') },
                  { key: 'approved', label: 'Approved', count: getStatusCount('approved') },
                  { key: 'rejected', label: 'Rejected', count: getStatusCount('rejected') },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? 'bg-surface text-text-primary shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab.label} ({tab.count})
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims List */}
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <motion.div variants={cardVariants}>
              <Card>
                <EmptyState
                  title="No Claims Found"
                  description={`No ${filter === 'all' ? '' : filter} claims found.`}
                  actionText="Create New Claim"
                  onAction={() => window.location.href = '/expense-claim/new'}
                />
              </Card>
            </motion.div>
          ) : (
            filteredClaims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {claim.employeeName}
                          </h3>
                          <StatusChip status={claim.engineerStatus} />
                        </div>
                        
                        <p className="text-text-secondary mb-4 font-medium">{claim.expenseType}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-text-secondary text-xs">Amount:</span>
                            <p className="font-semibold text-text-primary">₹{claim.billAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs">Bill Date:</span>
                            <p className="font-semibold text-text-primary">{claim.billDate}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs">LPO Number:</span>
                            <p className="font-semibold text-text-primary">{claim.lpoNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary text-xs">Submitted:</span>
                            <p className="font-semibold text-text-primary">{claim.submittedDate}</p>
                          </div>
                        </div>
                        
                        {claim.notes && (
                          <p className="text-text-secondary text-sm mt-3 italic bg-gray-50 p-3 rounded-lg">
                            "{claim.notes}"
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          title="View Details"
                        >
                          <Link href={`/expense-claim/${claim.id}`}>
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Add New Claim Button */}
        <motion.div 
          className="text-center"
          variants={cardVariants}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/expense-claim/new">
              <PlusIcon className="w-5 h-5" />
              Create New Claim
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ExpenseClaimPage;