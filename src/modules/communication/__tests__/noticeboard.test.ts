import { describe, it, expect } from 'vitest';
import {
  filterNoticesForAudience,
  getCalendarEventsForMonth,
  searchNotices,
  recordNoticeAcknowledgement,
  INITIAL_SCHOOL_CIRCULARS,
  STATUTORY_ACADEMIC_CALENDAR,
} from '../noticeboard';

describe('School Noticeboard & Circulars Engine', () => {
  it('filters notices correctly by audience role and student class level', () => {
    // 1. Admin sees everything (all 5 notices)
    const adminNotices = filterNoticesForAudience(INITIAL_SCHOOL_CIRCULARS, 'admin');
    expect(adminNotices.length).toBe(5);

    // 2. Teacher sees ALL_SCHOOL and FACULTY notices (notices 1, 4, 5)
    const teacherNotices = filterNoticesForAudience(INITIAL_SCHOOL_CIRCULARS, 'teacher');
    expect(teacherNotices.some((n) => n.targetAudience === 'FACULTY')).toBe(true);
    expect(teacherNotices.some((n) => n.targetAudience === 'BOARD_CLASSES')).toBe(false);

    // 3. Parent of Class 12 student (Senior Secondary / Board classes)
    const class12Notices = filterNoticesForAudience(INITIAL_SCHOOL_CIRCULARS, 'parent', 12);
    expect(class12Notices.some((n) => n.targetAudience === 'BOARD_CLASSES')).toBe(true);
    expect(class12Notices.some((n) => n.targetAudience === 'SENIOR_SECONDARY')).toBe(true);
    expect(class12Notices.some((n) => n.targetAudience === 'FACULTY')).toBe(false);

    // 4. Parent of Class 3 student (Primary - should NOT see board class or senior sec notices)
    const class3Notices = filterNoticesForAudience(INITIAL_SCHOOL_CIRCULARS, 'parent', 3);
    expect(class3Notices.some((n) => n.targetAudience === 'BOARD_CLASSES')).toBe(false);
    expect(class3Notices.some((n) => n.targetAudience === 'SENIOR_SECONDARY')).toBe(false);
    expect(class3Notices.some((n) => n.targetAudience === 'ALL_SCHOOL')).toBe(true);
  });

  it('filters academic calendar events for designated month', () => {
    // November 2024 (Month 11)
    const novEvents = getCalendarEventsForMonth(STATUTORY_ACADEMIC_CALENDAR, 2024, 11);
    expect(novEvents.length).toBeGreaterThanOrEqual(2);
    expect(novEvents.some((e) => e.title.includes('Pre-Board'))).toBe(true);
    expect(novEvents.some((e) => e.title.includes('PTM'))).toBe(true);

    // January 2025 (Month 1)
    const janEvents = getCalendarEventsForMonth(STATUTORY_ACADEMIC_CALENDAR, 2025, 1);
    expect(janEvents.some((e) => e.title.includes('Republic Day'))).toBe(true);
    expect(janEvents.some((e) => e.title.includes('Winter Vacation'))).toBe(true);
  });

  it('searches and filters notices by query string and category', () => {
    const queryResults = searchNotices(INITIAL_SCHOOL_CIRCULARS, 'uniform');
    expect(queryResults.length).toBe(1);
    expect(queryResults[0].circularNo).toBe('VK/CIR/2024-25/084');

    const examResults = searchNotices(INITIAL_SCHOOL_CIRCULARS, '', 'EXAM_SCHEDULE');
    expect(examResults.length).toBe(1);
    expect(examResults[0].category).toBe('EXAM_SCHEDULE');

    const noMatches = searchNotices(INITIAL_SCHOOL_CIRCULARS, 'nonexistent query 1234');
    expect(noMatches.length).toBe(0);
  });

  it('handles mandatory circular acknowledgement receipts', () => {
    const mandatoryNotice = INITIAL_SCHOOL_CIRCULARS[0]; // requires ack, starts at 412
    const { success, updatedNotice } = recordNoticeAcknowledgement(mandatoryNotice, 'parent-001');

    expect(success).toBe(true);
    expect(updatedNotice.readReceiptCount).toBe(413);

    const nonMandatory = INITIAL_SCHOOL_CIRCULARS[2]; // doesn't require ack
    const res2 = recordNoticeAcknowledgement(nonMandatory, 'parent-001');
    expect(res2.updatedNotice.readReceiptCount).toBe(nonMandatory.readReceiptCount);
  });
});
