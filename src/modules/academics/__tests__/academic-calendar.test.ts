import { describe, it, expect } from 'vitest';
import {
  calculateSessionWorkingDays,
  filterEventsByMonth,
  generateIcsCalendar,
  INITIAL_ACADEMIC_EVENTS,
  CalendarEvent,
} from '../academic-calendar';

describe('CBSE Institutional Annual Academic Calendar & Working Days Engine', () => {
  it('calculates session working days and validates CBSE Rule 14.1 compliance', () => {
    const stats = calculateSessionWorkingDays(
      INITIAL_ACADEMIC_EVENTS,
      '2026-04-01',
      '2027-03-31'
    );

    expect(stats.totalCalendarDays).toBe(365);
    expect(stats.totalSundays).toBeGreaterThanOrEqual(52);
    // Must comply with minimum secondary 200 days requirement
    expect(stats.compliesWithCbseSecondary).toBe(true);
    expect(stats.studentWorkingDays).toBeGreaterThanOrEqual(200);
    expect(stats.teacherWorkingDays).toBeGreaterThanOrEqual(stats.studentWorkingDays);
  });

  it('filters academic events correctly by year and month', () => {
    // Check October 2026 events (Gandhi Jayanti, Dussehra Break)
    const octEvents = filterEventsByMonth(INITIAL_ACADEMIC_EVENTS, 2026, 10);
    expect(octEvents.length).toBeGreaterThanOrEqual(2);
    const titles = octEvents.map((e) => e.title);
    expect(titles.some((t) => t.includes('Gandhi'))).toBe(true);
    expect(titles.some((t) => t.includes('Dussehra'))).toBe(true);

    // Month with no events
    const emptyMonth = filterEventsByMonth(INITIAL_ACADEMIC_EVENTS, 2028, 7);
    expect(emptyMonth.length).toBe(0);
  });

  it('generates standard RFC 5545 iCalendar content with valid VCALENDAR and VEVENT structure', () => {
    const sampleEvents: CalendarEvent[] = [
      {
        id: 'evt-test-1',
        title: 'Sample Board Exam',
        eventType: 'EXAMINATION',
        startDate: '2026-10-10',
        endDate: '2026-10-12',
        description: 'Mathematics assessment',
        isWorkingDayForStudents: true,
        isWorkingDayForTeachers: true,
        audience: 'ALL',
      },
    ];

    const ics = generateIcsCalendar(sampleEvents, 'Delhi Public School');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Sample Board Exam');
    expect(ics).toContain('CATEGORIES:EXAMINATION');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });
});
