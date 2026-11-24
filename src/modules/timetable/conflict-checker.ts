import { TimetableSlot } from '@/lib/database/types';

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictType?: 'teacher' | 'room' | 'section';
  message?: string;
  conflictingSlot?: TimetableSlot;
}

/**
 * Checks for teacher, room, and section timetable clashes
 */
export function checkTimetableConflict(
  existingSlots: TimetableSlot[],
  candidate: {
    sectionId: string;
    dayOfWeek: string;
    periodNumber: number;
    teacherName: string;
    roomNumber: string;
  }
): ConflictCheckResult {
  // 1. Teacher Conflict: Is this teacher already assigned elsewhere in the same period?
  const teacherClash = existingSlots.find(
    (s) =>
      s.day_of_week === candidate.dayOfWeek &&
      s.period_number === candidate.periodNumber &&
      s.teacher_name.toLowerCase() === candidate.teacherName.toLowerCase() &&
      s.section_id !== candidate.sectionId
  );

  if (teacherClash) {
    return {
      hasConflict: true,
      conflictType: 'teacher',
      message: `Scheduling Conflict: ${candidate.teacherName} is already assigned to ${teacherClash.subject_name} in ${teacherClash.room_number} during Period ${candidate.periodNumber} on ${candidate.dayOfWeek.toUpperCase()}.`,
      conflictingSlot: teacherClash,
    };
  }

  // 2. Room Conflict: Is this classroom or lab already occupied?
  const roomClash = existingSlots.find(
    (s) =>
      s.day_of_week === candidate.dayOfWeek &&
      s.period_number === candidate.periodNumber &&
      s.room_number.toLowerCase() === candidate.roomNumber.toLowerCase() &&
      s.section_id !== candidate.sectionId
  );

  if (roomClash) {
    return {
      hasConflict: true,
      conflictType: 'room',
      message: `Room Conflict: ${candidate.roomNumber} is already occupied by ${roomClash.subject_name} (${roomClash.teacher_name}) during Period ${candidate.periodNumber}.`,
      conflictingSlot: roomClash,
    };
  }

  return {
    hasConflict: false,
  };
}
