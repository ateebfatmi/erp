import React from 'react';
import { Metadata } from 'next';
import { UnifiedAcademicSetupHub } from '@/components/modules/academics/unified-academic-setup-hub';

export const metadata: Metadata = {
  title: 'Academic Masters Setup | VidyaOS Admin',
  description: 'Manage institutional classes, sections, CBSE subject allocations, house systems, and campus classrooms/smart labs.',
};

export default function AdminAcademicSetupPage() {
  return <UnifiedAcademicSetupHub initialTab="classes" />;
}
