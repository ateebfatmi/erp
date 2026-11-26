import React from 'react';
import { Metadata } from 'next';
import { UnifiedHomeworkHub } from '@/components/modules/homework/unified-homework-hub';

export const metadata: Metadata = {
  title: 'Homework, Assignments & Continuous Evaluation | VidyaOS Admin',
  description: 'Manage institutional homework assignments, student digital submissions, formative rubrics, and evaluation grading.',
};

export default function AdminHomeworkPage() {
  return <UnifiedHomeworkHub initialTab="roster" role="admin" />;
}
