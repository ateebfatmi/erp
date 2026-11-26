import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { UnifiedExamHub } from '@/components/modules/assessment/unified-exam-hub';

export default async function ExamsPage() {
  const auth = await getVerifiedAuthContext();
  const examTerms = await repository.getExamTerms(auth.tenantId);
  const enrollments = await repository.getEnrollments(auth.tenantId);

  // Sample student: Aarav Mehta
  const sampleStudent = enrollments[0];
  const marks = sampleStudent
    ? await repository.getExamMarksByEnrollment(auth.tenantId, sampleStudent.id)
    : [];

  return (
    <UnifiedExamHub
      initialTab="grading"
      examTerms={examTerms}
      sampleStudent={sampleStudent}
      marks={marks}
    />
  );
}
