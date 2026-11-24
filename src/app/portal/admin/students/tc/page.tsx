import { Metadata } from 'next';
import { TcRegistryManager } from '@/components/modules/students/tc-registry-manager';

export const metadata: Metadata = {
  title: 'Statutory Transfer Certificate (TC) Desk | VidyaOS Admin',
  description: 'Manage CBSE 20-point school leaving certificates, No-Dues reconciliations, UDISE+ PEN tagging, and public verification records.',
};

export default function AdminTcRegistryPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TcRegistryManager viewMode="admin" />
    </div>
  );
}
