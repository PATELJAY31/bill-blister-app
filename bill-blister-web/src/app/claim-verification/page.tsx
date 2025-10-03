'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import StatusChip from '@/components/ui/StatusChip';
import EmptyState from '@/components/ui/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { claimsAPI } from '@/lib/api';
import { Claim } from '@/types';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const ClaimVerificationPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Load pending claims from API
  React.useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        const response = await claimsAPI.getAll({ status: 'pending' });
        setClaims(response.data.data || []);
      } catch (error) {
        console.error('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  const handleApprove = async (claim: Claim) => {
    if (confirm('Are you sure you want to approve this claim?')) {
      try {
        await claimsAPI.verify(claim.id, { status: 'approved', notes: 'Approved by engineer' });
        
        console.log('Claim approved:', claim.id);
        alert('Claim approved successfully!');
        
        // Remove from pending list
        setClaims(prev => prev.filter(c => c.id !== claim.id));
        setSelectedClaim(null);
      } catch (error) {
        console.error('Failed to approve claim:', error);
        alert('Failed to approve claim. Please try again.');
      }
    }
  };

  const handleReject = async (claim: Claim) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (confirm('Are you sure you want to reject this claim?')) {
      try {
        await claimsAPI.verify(claim.id, { status: 'rejected', notes: rejectReason });
        
        console.log('Claim rejected:', claim.id, 'Reason:', rejectReason);
        alert('Claim rejected successfully!');
        
        // Remove from pending list
        setClaims(prev => prev.filter(c => c.id !== claim.id));
        setSelectedClaim(null);
        setShowRejectModal(false);
        setRejectReason('');
      } catch (error) {
        console.error('Failed to reject claim:', error);
        alert('Failed to reject claim. Please try again.');
      }
    }
  };

  const openRejectModal = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowRejectModal(true);
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
      <Layout title="Claim Verification">
        <EmptyState
          title="No Pending Claims"
          description="There are no claims waiting for verification."
          icon={<CheckCircleIcon className="w-12 h-12 text-green-600" />}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Claim Verification">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pending Verification</h2>
                  <p className="text-gray-600">{claims.length} claim{claims.length !== 1 ? 's' : ''} waiting for review</p>
                </div>
                <StatusChip status="pending" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims List */}
        <div className="space-y-4">
          <AnimatePresence>
            {claims.map((claim, index) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {claim.employeeName}
                          </h3>
                          <StatusChip status={claim.engineerStatus} />
                        </div>
                        
                        <p className="text-gray-600 mb-4 font-medium">{claim.expenseType}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500 text-xs">Amount:</span>
                            <p className="font-semibold text-gray-900">₹{claim.billAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Bill Date:</span>
                            <p className="font-semibold text-gray-900">{claim.billDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">LPO Number:</span>
                            <p className="font-semibold text-gray-900">{claim.lpoNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Submitted:</span>
                            <p className="font-semibold text-gray-900">{claim.submittedDate}</p>
                          </div>
                        </div>
                        
                        {claim.notes && (
                          <p className="text-sm text-gray-600 mb-4 italic bg-gray-50 p-3 rounded-lg">
                            "{claim.notes}"
                          </p>
                        )}

                        {/* Receipt Preview */}
                        {claim.receiptPath && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Receipt</h4>
                            <motion.div 
                              className="relative inline-block"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <img
                                src={claim.receiptPath}
                                alt="Receipt"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  // TODO: Open full-screen preview
                                  console.log('Open receipt preview');
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => handleApprove(claim)}
                          variant="success"
                          className="gap-2"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => openRejectModal(claim)}
                          variant="destructive"
                          className="gap-2"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedClaim && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Reject Claim
              </h3>
              
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this claim from {selectedClaim.employeeName}.
              </p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full min-h-[100px] resize-none mb-6 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                placeholder="Enter rejection reason..."
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={() => handleReject(selectedClaim)}
                  variant="destructive"
                >
                  Reject Claim
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ClaimVerificationPage;
