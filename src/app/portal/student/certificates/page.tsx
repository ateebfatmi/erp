import React from 'react';
import { Metadata } from 'next';
import { StudentParentCertificateDesk } from '@/components/modules/certificates/student-parent-certificate-desk';

export const metadata: Metadata = {
  title: 'My Issued Certificates & Bonafide | VidyaOS Student',
  description: 'View, verify, and download institutional bonafide, merit, and character certificates, or apply for new official credentials.',
};

export default function StudentCertificatesPage() {
  return <StudentParentCertificateDesk userRole="student" studentName="Aarav Mehta" />;
}
