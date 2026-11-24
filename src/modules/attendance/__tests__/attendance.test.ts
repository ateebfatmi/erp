import { describe, it, expect } from 'vitest';
import { repository } from '@/lib/database/repository';

describe('Attendance Engine & Register Checks', () => {
  const tenantId = 'tenant-dpga-delhi';
  const testDate = '2026-11-25';

  it('marks student attendance and updates existing records idempotently', async () => {
    // 1. Mark Aarav present
    const res1 = await repository.markAttendance(tenantId, [
      {
        enrollmentId: 'enr-aarav',
        attendanceDate: testDate,
        status: 'present',
      },
    ]);
    expect(res1.recordedCount).toBe(1);

    const records = await repository.getAttendanceByDate(tenantId, testDate);
    const aaravRec = records.find((r) => r.enrollment_id === 'enr-aarav');
    expect(aaravRec?.status).toBe('present');

    // 2. Teacher updates to excused leave
    await repository.markAttendance(tenantId, [
      {
        enrollmentId: 'enr-aarav',
        attendanceDate: testDate,
        status: 'excused',
        remarks: 'Doctor appointment',
      },
    ]);

    const updatedRecords = await repository.getAttendanceByDate(tenantId, testDate);
    const updatedAarav = updatedRecords.find((r) => r.enrollment_id === 'enr-aarav');
    expect(updatedAarav?.status).toBe('excused');
    expect(updatedAarav?.remarks).toBe('Doctor appointment');

    // Ensure no duplicate rows created
    const duplicates = updatedRecords.filter((r) => r.enrollment_id === 'enr-aarav');
    expect(duplicates.length).toBe(1);
  });
});
