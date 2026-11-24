import React from 'react';
import { DoorOpen } from 'lucide-react';
import { GatepassManager } from '@/components/modules/security/gatepass-manager';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <GatepassManager />
    </div>
  );
}
