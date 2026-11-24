import { describe, it, expect } from 'vitest';
import {
  allocateLanes,
  validateScheduleCollisions,
  recordHeatResults,
  calculateLiveSportsShield,
  INITIAL_RACE_HEATS,
  RaceHeat,
} from '../sports-meet';

describe('Annual Sports Day & Athletic Meet Engine', () => {
  it('should allocate sequential lanes 1 to 8 without collision and prevent lane overflow > 8', () => {
    const rawAthletes = [
      { athleteId: 'a1', athleteName: 'Runner 1', admissionNo: 'ADM-01', house: 'ASHOKA' as const, bibNumber: '11' },
      { athleteId: 'a2', athleteName: 'Runner 2', admissionNo: 'ADM-02', house: 'TAGORE' as const, bibNumber: '12' },
      { athleteId: 'a3', athleteName: 'Runner 3', admissionNo: 'ADM-03', house: 'SHIVAJI' as const, bibNumber: '13' },
    ];

    const allocated = allocateLanes(rawAthletes);
    expect(allocated.length).toBe(3);
    expect(allocated[0].laneNumber).toBe(1);
    expect(allocated[1].laneNumber).toBe(2);
    expect(allocated[2].laneNumber).toBe(3);

    const overflowList = Array.from({ length: 9 }).map((_, i) => ({
      athleteId: `ath-${i}`,
      athleteName: `Runner ${i}`,
      admissionNo: `ADM-${i}`,
      house: 'ASHOKA' as const,
      bibNumber: `${100 + i}`,
    }));

    expect(() => allocateLanes(overflowList)).toThrowError(/Track lane overflow/);
  });

  it('should detect athlete schedule collisions when assigned to overlapping heats', () => {
    const existingHeats: RaceHeat[] = [
      {
        id: 'h1',
        eventId: 'e1',
        heatNumber: 1,
        heatLabel: 'Heat 1',
        isFinal: false,
        status: 'SCHEDULED',
        scheduledTime: '10:00 AM',
        athletes: [
          { athleteId: 'ath-01', athleteName: 'Aarav Mehta', admissionNo: 'ADM-01', house: 'ASHOKA', bibNumber: '101', laneNumber: 1 },
        ],
      },
    ];

    const conflictCheck = validateScheduleCollisions(
      existingHeats,
      [{ athleteId: 'ath-01', athleteName: 'Aarav Mehta' }],
      '10:00 AM'
    );
    expect(conflictCheck.valid).toBe(false);
    expect(conflictCheck.conflicts.length).toBe(1);
    expect(conflictCheck.conflicts[0]).toContain('already assigned to Heat 1 at 10:00 AM');

    const cleanCheck = validateScheduleCollisions(
      existingHeats,
      [{ athleteId: 'ath-99', athleteName: 'New Runner' }],
      '10:00 AM'
    );
    expect(cleanCheck.valid).toBe(true);
    expect(cleanCheck.conflicts.length).toBe(0);
  });

  it('should record heat results and allocate gold (5 pts), silver (3 pts), and bronze (1 pt) to houses', () => {
    const heat: RaceHeat = {
      id: 'h-test',
      eventId: 'e-100m',
      heatNumber: 1,
      heatLabel: '100m Final',
      isFinal: true,
      status: 'IN_PROGRESS',
      scheduledTime: '10:00 AM',
      athletes: [
        { athleteId: 'a1', athleteName: 'Rohan (Ashoka)', admissionNo: 'ADM-01', house: 'ASHOKA', bibNumber: '1', laneNumber: 1 },
        { athleteId: 'a2', athleteName: 'Vikram (Shivaji)', admissionNo: 'ADM-02', house: 'SHIVAJI', bibNumber: '2', laneNumber: 2 },
        { athleteId: 'a3', athleteName: 'Sameer (Tagore)', admissionNo: 'ADM-03', house: 'TAGORE', bibNumber: '3', laneNumber: 3 },
      ],
    };

    const finishOrder = [
      { athleteId: 'a2', finishTimeOrDistance: '11.35s' }, // 1st: Shivaji (5 pts)
      { athleteId: 'a1', finishTimeOrDistance: '11.50s' }, // 2nd: Ashoka (3 pts)
      { athleteId: 'a3', finishTimeOrDistance: '11.72s' }, // 3rd: Tagore (1 pt)
    ];

    const { updatedHeat, housePoints } = recordHeatResults(heat, finishOrder);
    expect(updatedHeat.status).toBe('COMPLETED');
    expect(updatedHeat.results?.[0].medal).toBe('GOLD');
    expect(updatedHeat.results?.[0].position).toBe(1);
    expect(updatedHeat.results?.[1].medal).toBe('SILVER');
    expect(updatedHeat.results?.[2].medal).toBe('BRONZE');

    expect(housePoints.SHIVAJI).toBe(5);
    expect(housePoints.ASHOKA).toBe(3);
    expect(housePoints.TAGORE).toBe(1);
    expect(housePoints.RAMAN).toBe(0);
  });

  it('should calculate live sports shield rankings sorted by points and gold medals', () => {
    const standings = calculateLiveSportsShield({
      ASHOKA: { gold: 4, silver: 3, bronze: 2, points: 35 },
      SHIVAJI: { gold: 5, silver: 2, bronze: 1, points: 40 },
      TAGORE: { gold: 3, silver: 4, bronze: 2, points: 30 },
      RAMAN: { gold: 2, silver: 2, bronze: 4, points: 22 },
    });

    expect(standings[0].house).toBe('SHIVAJI');
    expect(standings[0].rank).toBe(1);
    expect(standings[0].points).toBe(40);
    expect(standings[1].house).toBe('ASHOKA');
    expect(standings[1].rank).toBe(2);
    expect(standings[3].house).toBe('RAMAN');
    expect(standings[3].rank).toBe(4);
  });
});
