import { describe, it, expect } from 'vitest';
import { checkTimetableConflict } from '../conflict-checker';
import { TimetableSlot } from '@/lib/database/types';

describe('Timetable Conflict Detection Engine', () => {
  const mockSlots: TimetableSlot[] = [
    {
      id: 'slot-1',
      tenant_id: 'tenant-1',
      academic_session_id: 'sess-1',
      section_id: 'sec-10-a',
      period_number: 2,
      period_name: 'Period 2',
      start_time: '08:45',
      end_time: '09:30',
      day_of_week: 'monday',
      subject_name: 'Science & Physics',
      teacher_name: 'Dr. Rajeshwar Sharma',
      room_number: 'Physics Lab 1',
    },
  ];

  it('detects teacher scheduling clash when teacher is booked in another section', () => {
    const result = checkTimetableConflict(mockSlots, {
      sectionId: 'sec-10-b', // Different section trying to book same teacher
      dayOfWeek: 'monday',
      periodNumber: 2,
      teacherName: 'Dr. Rajeshwar Sharma',
      roomNumber: 'Room 204',
    });

    expect(result.hasConflict).toBe(true);
    expect(result.conflictType).toBe('teacher');
    expect(result.message).toContain('already assigned');
  });

  it('detects room clash when different teacher books same laboratory', () => {
    const result = checkTimetableConflict(mockSlots, {
      sectionId: 'sec-10-b',
      dayOfWeek: 'monday',
      periodNumber: 2,
      teacherName: 'Mrs. Sunita Deshmukh',
      roomNumber: 'Physics Lab 1', // Same lab
    });

    expect(result.hasConflict).toBe(true);
    expect(result.conflictType).toBe('room');
    expect(result.message).toContain('already occupied');
  });

  it('permits scheduling when teacher and room are both free', () => {
    const result = checkTimetableConflict(mockSlots, {
      sectionId: 'sec-10-a',
      dayOfWeek: 'monday',
      periodNumber: 3, // Different period
      teacherName: 'Dr. Rajeshwar Sharma',
      roomNumber: 'Room 302',
    });

    expect(result.hasConflict).toBe(false);
  });
});
