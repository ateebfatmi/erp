import React from 'react';
import { EBSBManager } from '@/components/modules/activities/ebsb-manager';

export default function AdminEBSBPage() {
  return (
    <div className="space-y-6">
      <EBSBManager role="admin" />
    </div>
  );
}
