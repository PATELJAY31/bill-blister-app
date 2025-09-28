'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import EmptyState from '@/components/ui/EmptyState';
import { CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ClaimApprovalPage: React.FC = () => {
  return (
    <Layout title="Claim Approval">
      <EmptyState
        title="No Claims for Approval"
        description="There are currently no claims waiting for HO level approval. This feature will be implemented in the next phase."
        icon={<CheckCircleIcon className="w-12 h-12 text-blue-600" />}
        actionText="View Verified Claims"
        onAction={() => window.location.href = '/claim-verification'}
        secondaryActionText="View All Claims"
        onSecondaryAction={() => window.location.href = '/expense-claim'}
      />
    </Layout>
  );
};

export default ClaimApprovalPage;
