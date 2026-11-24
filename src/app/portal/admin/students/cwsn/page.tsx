import React from 'react';
import { CwsnIepManager } from '@/components/modules/academics/cwsn-iep-manager';

export default function AdminCwsnPage() {
  return (
    <div className="space-y-6">
      <CwsnIepManager role="admin" />
    </div>
  );
}
