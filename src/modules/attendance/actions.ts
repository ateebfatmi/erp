'use server';

import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { assertAuthorized } from '@/lib/permissions/evaluator';
import { revalidatePath } from 'next/cache';

export async function markClassAttendanceAction(payload: {
  attendanceDate: string;
  records: Array<{
    enrollmentId: string;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'excused';
    remarks?: string;
  }>;
}) {
  const auth = await getVerifiedAuthContext();
  await assertAuthorized(auth, 'attendance:mark');

  const result = await repository.markAttendance(
    auth.tenantId,
    payload.records.map((r) => ({
      ...r,
      attendanceDate: payload.attendanceDate,
    }))
  );

  revalidatePath('/portal/admin/attendance');
  revalidatePath('/portal/teacher/attendance');
  return { success: true, count: result.recordedCount };
}
