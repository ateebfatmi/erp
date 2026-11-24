import { describe, it, expect } from 'vitest';
import {
  filterDiaryEntries,
  verifyWeeklyDiaryBatch,
  INITIAL_DIARY_ENTRIES,
} from '../teacher-diary';

describe('Teacher Weekly Digital Logbook & Classroom Teaching Diary', () => {
  it('filters teaching diary entries by teacher, academic week, and subject', () => {
    const week32Math = filterDiaryEntries(INITIAL_DIARY_ENTRIES, 'tch-01', 32, 'Mathematics');
    expect(week32Math.length).toBe(3);
    expect(week32Math.every((e) => e.weekNumber === 32)).toBe(true);

    const nonExistent = filterDiaryEntries(INITIAL_DIARY_ENTRIES, 'tch-99');
    expect(nonExistent.length).toBe(0);
  });

  it('batches and records digital verification by academic coordinator or principal', () => {
    const unverified = [INITIAL_DIARY_ENTRIES[2]];
    const verified = verifyWeeklyDiaryBatch(unverified, 'Lesson verified. Good learning velocity.');

    expect(verified[0].supervisorStatus).toBe('PRINCIPAL_VERIFIED');
    expect(verified[0].supervisorRemarks).toContain('Lesson verified');
  });
});
