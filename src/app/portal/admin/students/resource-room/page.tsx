import React from 'react';
import { InclusiveResourceRoomManager } from '@/components/modules/academics/inclusive-resource-room-manager';

export default function AdminResourceRoomPage() {
  return (
    <div className="space-y-6">
      <InclusiveResourceRoomManager role="admin" />
    </div>
  );
}
