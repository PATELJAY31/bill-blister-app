'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import { mockClaims } from '@/data/mockData';
import { Claim } from '@/types';
import { DocumentTextIcon, PlusIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ExpenseClaimPage: React.FC = () => {
  const [claims] = useState<Claim[]>(mockClaims);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredClaims = filter === 'all' 
    ? claims 
    : claims.filter(claim => claim.engineerStatus === filter);

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
    return claims.filter(claim => claim.engineerStatus === status).length;
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
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Claims</p>
                <p className="stat-value">{claims.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-info" />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-value text-warning">{getStatusCount('pending')}</p>
              </div>
              <StatusChip status="pending" />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Approved</p>
                <p className="stat-value text-success">{getStatusCount('approved')}</p>
              </div>
              <StatusChip status="approved" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All Claims', count: claims.length },
              { key: 'pending', label: 'Pending', count: getStatusCount('pending') },
              { key: 'approved', label: 'Approved', count: getStatusCount('approved') },
              { key: 'rejected', label: 'Rejected', count: getStatusCount('rejected') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <div className="card">
              <EmptyState
                title="No Claims Found"
                description={`No ${filter === 'all' ? '' : filter} claims found.`}
                actionText="Create New Claim"
                onAction={() => window.location.href = '/expense-claim/new'}
              />
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div key={claim.id} className="card card-hover">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-title text-gray-900">
                        {claim.employeeName}
                      </h3>
                      <StatusChip status={claim.engineerStatus} />
                    </div>
                    
                    <p className="text-body text-gray-600 mb-4">{claim.expenseType}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-caption text-gray-500">Amount:</span>
                        <p className="font-medium text-gray-900">₹{claim.billAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-caption text-gray-500">Bill Date:</span>
                        <p className="font-medium text-gray-900">{claim.billDate}</p>
                      </div>
                      <div>
                        <span className="text-caption text-gray-500">LPO Number:</span>
                        <p className="font-medium text-gray-900">{claim.lpoNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-caption text-gray-500">Submitted:</span>
                        <p className="font-medium text-gray-900">{claim.submittedDate}</p>
                      </div>
                    </div>
                    
                    {claim.notes && (
                      <p className="text-caption text-gray-500 mt-3 italic">
                        "{claim.notes}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/expense-claim/${claim.id}`}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Claim Button */}
        <div className="text-center">
          <Link
            href="/expense-claim/new"
            className="btn btn-primary"
          >
            <PlusIcon className="w-4 h-4" />
            Create New Claim
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ExpenseClaimPage;