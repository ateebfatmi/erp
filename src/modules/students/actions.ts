'use server';

import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { assertAuthorized } from '@/lib/permissions/evaluator';
import { revalidatePath } from 'next/cache';

export async function createStudentAction(formData: FormData) {
  const auth = await getVerifiedAuthContext();
  await assertAuthorized(auth, 'students:create');

  const fullName = formData.get('fullName') as string;
  const admissionNumber = formData.get('admissionNumber') as string;
  const dob = formData.get('dob') as string;
  const gender = (formData.get('gender') as 'male' | 'female' | 'other') || 'male';
  const classId = formData.get('classId') as string;
  const sectionId = formData.get('sectionId') as string;
  const campusId = (formData.get('campusId') as string) || auth.campusId || 'campus-vk-01';

  if (!fullName || !admissionNumber || !classId || !sectionId) {
    return { success: false, error: 'All mandatory fields must be provided.' };
  }

  const enrollment = await repository.createStudentEnrollment(auth.tenantId, {
    fullName,
    admissionNumber,
    dob,
    gender,
    classId,
    sectionId,
    campusId,
  });

  revalidatePath('/portal/admin/students');
  return { success: true, data: enrollment };
}

export async function getStudentsAction(filters?: { classId?: string; sectionId?: string; search?: string }) {
  const auth = await getVerifiedAuthContext();
  await assertAuthorized(auth, 'students:view');
  const students = await repository.getEnrollments(auth.tenantId, filters);
  return { success: true, data: students };
}
