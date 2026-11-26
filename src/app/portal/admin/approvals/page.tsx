import React from 'react';
import { Metadata } from 'next';
import { UnifiedApprovalsHub } from '@/components/modules/approvals/unified-approvals-hub';

export const metadata: Metadata = {
  title: 'Executive Approvals & Workflow Governance | VidyaOS Admin',
  description: 'Manage inter-departmental pending approvals for staff leaves, fee concessions, capital procurement, and Transfer Certificates.',
};

export default function AdminApprovalsPage() {
  return <UnifiedApprovalsHub initialTab="inbox" />;
}
