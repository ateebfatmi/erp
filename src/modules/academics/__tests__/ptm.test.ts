import { describe, it, expect } from 'vitest';
import {
  generatePtmSlots,
  bookPtmSlot,
  cancelPtmSlot,
} from '../ptm';

describe('VidyaOS PTM Slot Booking Engine', () => {
  it('generates 15-minute consultation slots across session timing', () => {
    // 09:00 AM to 01:00 PM (4 hours = 16 slots of 15 min each)
    const slots = generatePtmSlots('2024-11-30', 9, 13, 15);
    expect(slots).toHaveLength(16);
    expect(slots[0].timeRange).toBe('9:00 AM - 9:15 AM');
    expect(slots[0].isBooked).toBe(false);
  });

  it('reserves an available slot and prevents double-booking', () => {
    let slots = generatePtmSlots('2024-11-30', 9, 11, 15); // 8 slots

    slots = bookPtmSlot(slots, 'SLOT-1', {
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      parentName: 'Sanjay Mehta',
      studentRollNo: '14',
      discussionNotes: 'Discussing Math Olympiad preparation',
    });

    expect(slots[0].isBooked).toBe(true);
    expect(slots[0].bookedByStudentName).toBe('Aarav Mehta');

    // Attempting to book the same slot again should throw
    expect(() =>
      bookPtmSlot(slots, 'SLOT-1', {
        studentId: 'std-102',
        studentName: 'Ananya Deshmukh',
        parentName: 'Dr. Sunita Deshmukh',
        studentRollNo: '01',
      })
    ).toThrow('already reserved');

    // Attempting to book another slot for the same student should throw
    expect(() =>
      bookPtmSlot(slots, 'SLOT-2', {
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        parentName: 'Sanjay Mehta',
        studentRollNo: '14',
      })
    ).toThrow('already holds an active consultation slot');
  });

  it('cancels and frees a slot successfully', () => {
    let slots = generatePtmSlots('2024-11-30', 9, 11, 15);

    slots = bookPtmSlot(slots, 'SLOT-1', {
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      parentName: 'Sanjay Mehta',
      studentRollNo: '14',
    });
    expect(slots[0].isBooked).toBe(true);

    slots = cancelPtmSlot(slots, 'SLOT-1');
    expect(slots[0].isBooked).toBe(false);
    expect(slots[0].bookedByStudentId).toBeUndefined();
  });
});
