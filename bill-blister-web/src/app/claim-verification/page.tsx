'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import { mockClaims } from '@/data/mockData';
import { Claim } from '@/types';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const ClaimVerificationPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>(mockClaims.filter(claim => claim.engineerStatus === 'pending'));
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (claim: Claim) => {
    if (confirm('Are you sure you want to approve this claim?')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Claim approved:', claim.id);
      alert('Claim approved successfully!');
      
      // Remove from pending list
      setClaims(prev => prev.filter(c => c.id !== claim.id));
      setSelectedClaim(null);
    }
  };

  const handleReject = async (claim: Claim) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (confirm('Are you sure you want to reject this claim?')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Claim rejected:', claim.id, 'Reason:', rejectReason);
      alert('Claim rejected successfully!');
      
      // Remove from pending list
      setClaims(prev => prev.filter(c => c.id !== claim.id));
      setSelectedClaim(null);
      setShowRejectModal(false);
      setRejectReason('');
    }
  };

  const openRejectModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowRejectModal(true);
  };

  if (claims.length === 0) {
    return (
      <Layout title="Claim Verification">
        <EmptyState
          title="No Pending Claims"
          description="There are no claims waiting for verification."
          icon={<CheckCircleIcon className="w-12 h-12 text-status-success" />}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Claim Verification">
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Pending Verification</h2>
              <p className="text-text-secondary">{claims.length} claim{claims.length !== 1 ? 's' : ''} waiting for review</p>
            </div>
            <StatusChip status="pending" />
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {claim.employeeName}
                    </h3>
                    <StatusChip status={claim.engineerStatus} />
                  </div>
                  
                  <p className="text-text-secondary mb-4">{claim.expenseType}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-text-tertiary">Amount:</span>
                      <p className="font-medium text-text-primary">₹{claim.billAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Bill Date:</span>
                      <p className="font-medium text-text-primary">{claim.billDate}</p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">LPO Number:</span>
                      <p className="font-medium text-text-primary">{claim.lpoNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Submitted:</span>
                      <p className="font-medium text-text-primary">{claim.submittedDate}</p>
                    </div>
                  </div>
                  
                  {claim.notes && (
                    <p className="text-sm text-text-secondary mb-4 italic">
                      "{claim.notes}"
                    </p>
                  )}

                  {/* Receipt Preview */}
                  {claim.receiptPath && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-text-primary mb-2">Receipt</h4>
                      <div className="relative inline-block">
                        <img
                          src={claim.receiptPath}
                          alt="Receipt"
                          className="w-32 h-32 object-cover rounded-lg border border-divider cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            // TODO: Open full-screen preview
                            console.log('Open receipt preview');
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                          <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(claim)}
                    className="btn-success inline-flex items-center px-4 py-2 text-sm"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  
                  <button
                    onClick={() => openRejectModal(claim)}
                    className="btn-error inline-flex items-center px-4 py-2 text-sm"
                  >
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Reject Claim
            </h3>
            
            <p className="text-text-secondary mb-4">
              Please provide a reason for rejecting this claim from {selectedClaim.employeeName}.
            </p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="form-input min-h-[100px] resize-none mb-4"
              placeholder="Enter rejection reason..."
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              
              <button
                onClick={() => handleReject(selectedClaim)}
                className="btn-error px-4 py-2"
              >
                Reject Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClaimVerificationPage;
