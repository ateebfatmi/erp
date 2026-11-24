/**
 * VidyaOS Parent-Teacher Meeting (PTM) & Slot Booking Engine
 * Organizes 10-15 minute consultation slots to eliminate waiting lines during academic reviews.
 */

export interface PtmSession {
  ptmId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "13:00"
  slotDurationMinutes: number; // 15
  targetGradeSection: string;
}

export interface PtmSlot {
  slotId: string;
  timeRange: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  roomNumber: string;
  isBooked: boolean;
  bookedByStudentId?: string;
  bookedByStudentName?: string;
  bookedByParentName?: string;
  studentRollNo?: string;
  discussionNotes?: string;
  bookedAt?: string;
}

/**
 * Generates available 15-minute consultation slots for a teacher during a PTM session
 */
export function generatePtmSlots(
  ptmDate: string,
  startHour: number = 9,
  endHour: number = 13,
  slotMinutes: number = 15,
  teacherName: string = 'Ms. Priya Sen',
  subject: string = 'Class Teacher (Grade 10-A) & Mathematics',
  roomNumber: string = 'Room 204'
): PtmSlot[] {
  const slots: PtmSlot[] = [];
  let index = 1;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += slotMinutes) {
      const endM = m + slotMinutes;
      const startPeriod = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const endPeriod = endM === 60
        ? `${(h + 1).toString().padStart(2, '0')}:00`
        : `${h.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

      // Convert to 12-hour AM/PM label
      const formatTime = (timeStr: string) => {
        const [hr, min] = timeStr.split(':').map(Number);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const formattedHr = hr % 12 || 12;
        return `${formattedHr}:${min.toString().padStart(2, '0')} ${ampm}`;
      };

      const rangeLabel = `${formatTime(startPeriod)} - ${formatTime(endPeriod)}`;

      slots.push({
        slotId: `SLOT-${index++}`,
        timeRange: rangeLabel,
        teacherId: 'tch-priya',
        teacherName,
        subject,
        roomNumber,
        isBooked: false,
      });
    }
  }

  return slots;
}

/**
 * Books an available PTM slot for a student guardian
 */
export function bookPtmSlot(
  slots: PtmSlot[],
  slotId: string,
  booking: {
    studentId: string;
    studentName: string;
    parentName: string;
    studentRollNo: string;
    discussionNotes?: string;
  }
): PtmSlot[] {
  const target = slots.find((s) => s.slotId === slotId);
  if (!target) {
    throw new Error(`Slot with ID ${slotId} not found.`);
  }

  if (target.isBooked) {
    throw new Error(`Slot ${target.timeRange} is already reserved by another guardian.`);
  }

  // Prevent multiple bookings for the same student with the same teacher
  const alreadyBooked = slots.some((s) => s.bookedByStudentId === booking.studentId);
  if (alreadyBooked) {
    throw new Error(`Student ${booking.studentName} already holds an active consultation slot.`);
  }

  return slots.map((s) => {
    if (s.slotId !== slotId) return s;
    return {
      ...s,
      isBooked: true,
      bookedByStudentId: booking.studentId,
      bookedByStudentName: booking.studentName,
      bookedByParentName: booking.parentName,
      studentRollNo: booking.studentRollNo,
      discussionNotes: booking.discussionNotes || 'Term-2 Board Exam Preparation discussion',
      bookedAt: new Date().toISOString(),
    };
  });
}

/**
 * Cancels a previously booked consultation slot
 */
export function cancelPtmSlot(slots: PtmSlot[], slotId: string): PtmSlot[] {
  return slots.map((s) => {
    if (s.slotId !== slotId) return s;
    return {
      ...s,
      isBooked: false,
      bookedByStudentId: undefined,
      bookedByStudentName: undefined,
      bookedByParentName: undefined,
      studentRollNo: undefined,
      discussionNotes: undefined,
      bookedAt: undefined,
    };
  });
}
