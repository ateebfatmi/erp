import { describe, it, expect } from 'vitest';
import {
  calculateHouseStandings,
  getStudentDisciplineSummary,
  filterBehaviorRecords,
  INITIAL_BEHAVIOR_RECORDS,
} from '../discipline';

describe('Student Pastoral Care & House Cup Merit Engine', () => {
  it('calculates real-time House Cup standings across positive and negative points', () => {
    const standings = calculateHouseStandings(INITIAL_BEHAVIOR_RECORDS, 1000);

    expect(standings.length).toBe(4);
    // Standings should be sorted descending
    expect(standings[0].totalPoints).toBeGreaterThanOrEqual(standings[1].totalPoints);
    expect(standings[1].totalPoints).toBeGreaterThanOrEqual(standings[2].totalPoints);
    expect(standings[0].rank).toBe(1);
    expect(standings[3].rank).toBe(4);

    // Raman gained +30 (1030)
    const raman = standings.find((s) => s.house === 'RAMAN');
    expect(raman?.totalPoints).toBe(1030);
    expect(raman?.meritsCount).toBe(1);

    // Shivaji had -5 and -15 demerits (1000 - 20 = 980)
    const shivaji = standings.find((s) => s.house === 'SHIVAJI');
    expect(shivaji?.totalPoints).toBe(980);
    expect(shivaji?.demeritsCount).toBe(2);
  });

  it('calculates individual student behavioral summary and net score', () => {
    const aaravSummary = getStudentDisciplineSummary('std-101', INITIAL_BEHAVIOR_RECORDS);

    expect(aaravSummary.totalMeritPoints).toBe(25);
    expect(aaravSummary.totalDemeritPoints).toBe(0);
    expect(aaravSummary.netScore).toBe(25);
    expect(aaravSummary.incidentCount).toBe(1);

    const varunSummary = getStudentDisciplineSummary('std-107', INITIAL_BEHAVIOR_RECORDS);
    expect(varunSummary.totalDemeritPoints).toBe(15);
    expect(varunSummary.netScore).toBe(-15);
  });

  it('filters behavioral incident records by house and incident type', () => {
    const meritRecords = filterBehaviorRecords(INITIAL_BEHAVIOR_RECORDS, 'ALL', 'MERIT');
    expect(meritRecords.every((r) => r.incidentType === 'MERIT')).toBe(true);
    expect(meritRecords.length).toBe(3);

    const demeritRecords = filterBehaviorRecords(INITIAL_BEHAVIOR_RECORDS, 'ALL', 'DEMERIT');
    expect(demeritRecords.every((r) => r.incidentType === 'DEMERIT')).toBe(true);
    expect(demeritRecords.length).toBe(2);

    const searchResult = filterBehaviorRecords(INITIAL_BEHAVIOR_RECORDS, 'ALL', 'ALL', 'Olympiad');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].studentName).toBe('Aarav Mehta');
  });
});
