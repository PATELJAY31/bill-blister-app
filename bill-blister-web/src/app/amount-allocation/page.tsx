'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import InfoRow from '@/components/ui/InfoRow';
import EmptyState from '@/components/ui/EmptyState';
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
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="stat-label">Total Cash Issued</p>
                <p className="stat-value text-primary">₹{totalCashIssued.toFixed(2)}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-success" />
            </div>
            <p className="text-caption text-gray-500">
              Across {allocations.length} allocation{allocations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="stat-label">Active Allocations</p>
                <p className="stat-value">{filteredAllocations.length}</p>
              </div>
              <DocumentTextIcon className="w-8 h-8 text-info" />
            </div>
            <p className="text-caption text-gray-500">
              Currently showing
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-subtitle">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Employee Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by employee name..."
                value={filters.employeeName}
                onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expense Type</label>
              <select
                className="form-input"
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
        </div>

        {/* Allocations List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-subtitle">
              Allocations ({filteredAllocations.length})
            </h3>
          </div>
          
          <div className="space-y-0">
            {filteredAllocations.map((allocation) => (
              <div
                key={allocation.id}
                className="card-hover rounded-lg"
                onClick={() => handleAllocationClick(allocation)}
              >
                <InfoRow
                  label={allocation.employeeName}
                  value={`₹${allocation.cashIssued.toFixed(2)}`}
                  icon={<UserIcon className="w-5 h-5" />}
                />
                <div className="px-4 pb-3">
                  <div className="flex items-center justify-between text-caption text-gray-500">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AmountAllocationPage;