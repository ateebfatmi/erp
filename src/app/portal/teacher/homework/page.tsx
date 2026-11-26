import React from 'react';
import { Metadata } from 'next';
import { UnifiedHomeworkHub } from '@/components/modules/homework/unified-homework-hub';

export const metadata: Metadata = {
  title: 'Faculty Homework & Assignment Evaluation Suite | VidyaOS Teacher',
  description: 'Assign class tasks, monitor student submission rates, and grade formative homework submissions.',
};

export default function TeacherHomeworkPage() {
  return <UnifiedHomeworkHub initialTab="roster" role="teacher" />;
}
