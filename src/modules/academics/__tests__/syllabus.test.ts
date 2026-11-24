import { describe, it, expect } from 'vitest';
import {
  calculateSyllabusProgress,
  evaluateUnitLag,
  filterSyllabusUnits,
  INITIAL_CBSE_SYLLABUS,
  SyllabusUnit,
} from '../syllabus';

describe('CBSE Syllabus Progression & Curriculum Velocity Engine', () => {
  it('calculates aggregate syllabus completion metrics correctly', () => {
    const summary = calculateSyllabusProgress(INITIAL_CBSE_SYLLABUS);

    expect(summary.totalAllocated).toBeGreaterThan(0);
    expect(summary.totalCompleted).toBeGreaterThan(0);
    expect(summary.overallPercentage).toBeGreaterThanOrEqual(0);
    expect(summary.overallPercentage).toBeLessThanOrEqual(100);
    expect(summary.laggingUnitsCount).toBe(2);
    expect(summary.completedUnitsCount).toBe(4);
  });

  it('evaluates unit lag correctly against target milestone dates', () => {
    const completedUnit: SyllabusUnit = {
      id: 'test-1',
      subjectCode: '042',
      subjectName: 'Physics',
      grade: 12,
      unitNo: 1,
      title: 'Electrostatics',
      allocatedPeriods: 20,
      completedPeriods: 20,
      term: 1,
      targetCompletionDate: '2024-08-31',
      status: 'COMPLETED',
      nepCompetencies: [],
    };
    expect(evaluateUnitLag(completedUnit, '2024-11-25')).toBe('COMPLETED');

    const laggingUnit: SyllabusUnit = {
      id: 'test-2',
      subjectCode: '042',
      subjectName: 'Physics',
      grade: 12,
      unitNo: 2,
      title: 'Current Electricity',
      allocatedPeriods: 20,
      completedPeriods: 15,
      term: 1,
      targetCompletionDate: '2024-10-31',
      status: 'IN_PROGRESS',
      nepCompetencies: [],
    };
    expect(evaluateUnitLag(laggingUnit, '2024-11-25')).toBe('LAGGING');

    const onTrackUnit: SyllabusUnit = {
      id: 'test-3',
      subjectCode: '042',
      subjectName: 'Physics',
      grade: 12,
      unitNo: 3,
      title: 'Optics',
      allocatedPeriods: 30,
      completedPeriods: 10,
      term: 2,
      targetCompletionDate: '2024-12-31',
      status: 'IN_PROGRESS',
      nepCompetencies: [],
    };
    expect(evaluateUnitLag(onTrackUnit, '2024-11-25')).toBe('ON_TRACK');
  });

  it('filters syllabus units by term and subject code', () => {
    const term1Units = filterSyllabusUnits(INITIAL_CBSE_SYLLABUS, 1);
    expect(term1Units.every((u) => u.term === 1)).toBe(true);

    const term2Units = filterSyllabusUnits(INITIAL_CBSE_SYLLABUS, 2);
    expect(term2Units.every((u) => u.term === 2)).toBe(true);

    const physicsUnits = filterSyllabusUnits(INITIAL_CBSE_SYLLABUS, 'ALL', '042');
    expect(physicsUnits.every((u) => u.subjectCode === '042')).toBe(true);
    expect(physicsUnits.length).toBe(5);

    const mathUnits = filterSyllabusUnits(INITIAL_CBSE_SYLLABUS, 'ALL', '041');
    expect(mathUnits.every((u) => u.subjectCode === '041')).toBe(true);
    expect(mathUnits.length).toBe(4);
  });
});
