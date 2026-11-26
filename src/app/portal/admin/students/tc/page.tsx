import { Metadata } from 'next';
import { UnifiedStudentsHub } from '@/components/modules/students/unified-students-hub';

export const metadata: Metadata = {
  title: 'Statutory Transfer Certificate (TC) Desk | VidyaOS Admin',
  description: 'Manage CBSE 20-point school leaving certificates, No-Dues reconciliations, UDISE+ PEN tagging, and public verification records.',
};

export default function AdminTcRegistryPage() {
  return <UnifiedStudentsHub initialTab="tc" />;
}
