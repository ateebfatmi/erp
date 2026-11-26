import React from 'react';
import { Metadata } from 'next';
import { ParentHomeworkTracker } from '@/components/modules/homework/parent-homework-tracker';

export const metadata: Metadata = {
  title: 'Child Homework & Progress Tracker | VidyaOS Parent',
  description: 'Track daily subject coursework, deadlines, submission status, and evaluated marks for your ward.',
};

export default function ParentHomeworkPage() {
  return <ParentHomeworkTracker childName="Aarav Mehta" className="Class 10 - Section A" />;
}
