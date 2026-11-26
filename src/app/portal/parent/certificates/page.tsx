import React from 'react';
import { Metadata } from 'next';
import { StudentParentCertificateDesk } from '@/components/modules/certificates/student-parent-certificate-desk';

export const metadata: Metadata = {
  title: 'Child Certificates & Bonafide Issuance | VidyaOS Parent',
  description: 'Access digitally verified institutional certificates, download stamped bonafide documents, or apply for certificates on behalf of your ward.',
};

export default function ParentCertificatesPage() {
  return <StudentParentCertificateDesk userRole="parent" studentName="Aarav Mehta" />;
}
