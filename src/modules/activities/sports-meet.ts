/**
 * Annual Sports Day & Athletic Meet Heat Sheet Engine
 * Manages Olympic-standard 8-lane track heats, field trials, lane allocations,
 * athlete bib scheduling, collision checking, and house championship points.
 */

import { HouseName } from './house-system';
export type { HouseName };

export type AgeCategory = 'SUB_JUNIOR_U12' | 'JUNIOR_U14' | 'SENIOR_U17' | 'SUPER_SENIOR_U19';
export type GenderDivision = 'BOYS' | 'GIRLS' | 'MIXED';
export type EventType = 'TRACK' | 'FIELD';

export interface AthleticEvent {
  id: string;
  title: string;
  eventType: EventType;
  ageCategory: AgeCategory;
  gender: GenderDivision;
  scheduledTime: string; // e.g. "09:30 AM"
  trackLengthMeters?: number; // 100, 200, 400, 800, 400 (4x100m)
  venue: string;
  isRelay?: boolean;
}

export interface HeatAthlete {
  athleteId: string;
  athleteName: string;
  admissionNo: string;
  house: HouseName;
  bibNumber: string;
  laneNumber: number; // 1 to 8 for track
  seedTime?: string; // e.g. "11.80s"
}

export interface HeatResult {
  athleteId: string;
  athleteName: string;
  house: HouseName;
  laneNumber: number;
  finishTimeOrDistance: string; // e.g. "11.42s" or "5.68m"
  position: number; // 1, 2, 3...
  pointsAwarded: number;
  medal?: 'GOLD' | 'SILVER' | 'BRONZE';
}

export interface RaceHeat {
  id: string;
  eventId: string;
  heatNumber: number;
  heatLabel: string; // "Heat 1 of 3" or "Final"
  isFinal: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  scheduledTime: string;
  athletes: HeatAthlete[];
  results?: HeatResult[];
}

export interface SportsShieldStanding {
  house: HouseName;
  gold: number;
  silver: number;
  bronze: number;
  totalMedals: number;
  points: number;
  rank: number;
}

/**
 * Allocates lanes 1 through 8 to athletes, ensuring no duplicates and max 8 athletes.
 */
export function allocateLanes(athletes: Omit<HeatAthlete, 'laneNumber'>[]): HeatAthlete[] {
  if (athletes.length > 8) {
    throw new Error('Track lane overflow: Maximum 8 athletes permitted on a standard 8-lane track');
  }

  return athletes.map((athlete, index) => ({
    ...athlete,
    laneNumber: index + 1,
  }));
}

/**
 * Checks if any athlete in a proposed heat is already scheduled in an overlapping heat.
 */
export function validateScheduleCollisions(
  existingHeats: RaceHeat[],
  newHeatAthletes: { athleteId: string; athleteName: string }[],
  newHeatTime: string
): { valid: boolean; conflicts: string[] } {
  const conflicts: string[] = [];

  const timeMatches = existingHeats.filter(
    (h) => h.scheduledTime === newHeatTime && h.status !== 'COMPLETED'
  );

  for (const newAthlete of newHeatAthletes) {
    for (const h of timeMatches) {
      const match = h.athletes.find((a) => a.athleteId === newAthlete.athleteId);
      if (match) {
        conflicts.push(
          `Athlete ${newAthlete.athleteName} is already assigned to ${h.heatLabel} at ${newHeatTime}`
        );
      }
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Records heat finish positions and awards official Cock House points.
 * Standard Track: 1st (Gold) = 5 pts, 2nd (Silver) = 3 pts, 3rd (Bronze) = 1 pt.
 * Relay Track: 1st (Gold) = 10 pts, 2nd (Silver) = 6 pts, 3rd (Bronze) = 2 pts.
 */
export function recordHeatResults(
  heat: RaceHeat,
  finishOrder: { athleteId: string; finishTimeOrDistance: string }[],
  isRelay = false
): {
  updatedHeat: RaceHeat;
  housePoints: Record<HouseName, number>;
} {
  const housePoints: Record<HouseName, number> = {
    ASHOKA: 0,
    TAGORE: 0,
    SHIVAJI: 0,
    RAMAN: 0,
  };

  const goldPts = isRelay ? 10 : 5;
  const silverPts = isRelay ? 6 : 3;
  const bronzePts = isRelay ? 2 : 1;

  const results: HeatResult[] = finishOrder.map((item, idx) => {
    const athlete = heat.athletes.find((a) => a.athleteId === item.athleteId);
    if (!athlete) {
      throw new Error(`Athlete ID ${item.athleteId} not found in heat roster`);
    }

    const pos = idx + 1;
    let pts = 0;
    let medal: 'GOLD' | 'SILVER' | 'BRONZE' | undefined = undefined;

    if (pos === 1) {
      pts = goldPts;
      medal = 'GOLD';
      housePoints[athlete.house] += goldPts;
    } else if (pos === 2) {
      pts = silverPts;
      medal = 'SILVER';
      housePoints[athlete.house] += silverPts;
    } else if (pos === 3) {
      pts = bronzePts;
      medal = 'BRONZE';
      housePoints[athlete.house] += bronzePts;
    }

    return {
      athleteId: athlete.athleteId,
      athleteName: athlete.athleteName,
      house: athlete.house,
      laneNumber: athlete.laneNumber,
      finishTimeOrDistance: item.finishTimeOrDistance,
      position: pos,
      pointsAwarded: pts,
      medal,
    };
  });

  const updatedHeat: RaceHeat = {
    ...heat,
    status: 'COMPLETED',
    results,
  };

  return { updatedHeat, housePoints };
}

/**
 * Calculates current Cock House Athletic Shield standings ordered by points, then gold medals.
 */
export function calculateLiveSportsShield(
  tallies: Record<HouseName, { gold: number; silver: number; bronze: number; points: number }>
): SportsShieldStanding[] {
  const houses: HouseName[] = ['ASHOKA', 'TAGORE', 'SHIVAJI', 'RAMAN'];

  const standings: SportsShieldStanding[] = houses.map((house) => {
    const t = tallies[house] || { gold: 0, silver: 0, bronze: 0, points: 0 };
    return {
      house,
      gold: t.gold,
      silver: t.silver,
      bronze: t.bronze,
      totalMedals: t.gold + t.silver + t.bronze,
      points: t.points,
      rank: 1,
    };
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.gold - a.gold;
  });

  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return standings;
}

/**
 * Pre-seeded Athletic Events
 */
export const INITIAL_ATHLETIC_EVENTS: AthleticEvent[] = [
  {
    id: 'ath-100m-sr',
    title: '100m Senior Boys Dash (Final)',
    eventType: 'TRACK',
    ageCategory: 'SENIOR_U17',
    gender: 'BOYS',
    scheduledTime: '10:00 AM',
    trackLengthMeters: 100,
    venue: 'Main Synthetic Track - Straight 100m',
  },
  {
    id: 'ath-200m-sr',
    title: '200m Senior Girls Sprint (Final)',
    eventType: 'TRACK',
    ageCategory: 'SENIOR_U17',
    gender: 'GIRLS',
    scheduledTime: '10:30 AM',
    trackLengthMeters: 200,
    venue: 'Main Synthetic Track - Curve & Straight',
  },
  {
    id: 'ath-4x100m-relay',
    title: '4x100m Inter-House Senior Championship Relay',
    eventType: 'TRACK',
    ageCategory: 'SENIOR_U17',
    gender: 'BOYS',
    scheduledTime: '11:15 AM',
    trackLengthMeters: 400,
    venue: 'Main Synthetic 400m Oval Track',
    isRelay: true,
  },
  {
    id: 'ath-longjump-jr',
    title: 'Long Jump Junior Boys Championship',
    eventType: 'FIELD',
    ageCategory: 'JUNIOR_U14',
    gender: 'BOYS',
    scheduledTime: '11:45 AM',
    venue: 'Athletic Arena Sand Pit A',
  },
];

/**
 * Pre-seeded Race Heats with 8-lane assignments
 */
export const INITIAL_RACE_HEATS: RaceHeat[] = [
  {
    id: 'heat-100m-01',
    eventId: 'ath-100m-sr',
    heatNumber: 1,
    heatLabel: 'Grand Final (8 Lanes)',
    isFinal: true,
    status: 'COMPLETED',
    scheduledTime: '10:00 AM',
    athletes: [
      { athleteId: 'ath-01', athleteName: 'Aarav Mehta', admissionNo: 'ADM-2024-001', house: 'ASHOKA', bibNumber: '101', laneNumber: 1, seedTime: '11.85s' },
      { athleteId: 'ath-02', athleteName: 'Kabir Verma', admissionNo: 'ADM-2024-019', house: 'TAGORE', bibNumber: '102', laneNumber: 2, seedTime: '11.60s' },
      { athleteId: 'ath-03', athleteName: 'Devansh Rathore', admissionNo: 'ADM-2024-033', house: 'SHIVAJI', bibNumber: '103', laneNumber: 3, seedTime: '11.45s' },
      { athleteId: 'ath-04', athleteName: 'Rohan Deshmukh', admissionNo: 'ADM-2024-045', house: 'RAMAN', bibNumber: '104', laneNumber: 4, seedTime: '11.52s' },
      { athleteId: 'ath-05', athleteName: 'Aryan Bhatia', admissionNo: 'ADM-2024-055', house: 'ASHOKA', bibNumber: '105', laneNumber: 5, seedTime: '11.75s' },
      { athleteId: 'ath-06', athleteName: 'Sahil Kapoor', admissionNo: 'ADM-2024-067', house: 'TAGORE', bibNumber: '106', laneNumber: 6, seedTime: '11.90s' },
      { athleteId: 'ath-07', athleteName: 'Manish Pandey', admissionNo: 'ADM-2024-078', house: 'SHIVAJI', bibNumber: '107', laneNumber: 7, seedTime: '12.05s' },
      { athleteId: 'ath-08', athleteName: 'Pranav Joshi', admissionNo: 'ADM-2024-089', house: 'RAMAN', bibNumber: '108', laneNumber: 8, seedTime: '12.15s' },
    ],
    results: [
      { athleteId: 'ath-03', athleteName: 'Devansh Rathore', house: 'SHIVAJI', laneNumber: 3, finishTimeOrDistance: '11.38s', position: 1, pointsAwarded: 5, medal: 'GOLD' },
      { athleteId: 'ath-04', athleteName: 'Rohan Deshmukh', house: 'RAMAN', laneNumber: 4, finishTimeOrDistance: '11.49s', position: 2, pointsAwarded: 3, medal: 'SILVER' },
      { athleteId: 'ath-01', athleteName: 'Aarav Mehta', house: 'ASHOKA', laneNumber: 1, finishTimeOrDistance: '11.62s', position: 3, pointsAwarded: 1, medal: 'BRONZE' },
      { athleteId: 'ath-02', athleteName: 'Kabir Verma', house: 'TAGORE', laneNumber: 2, finishTimeOrDistance: '11.70s', position: 4, pointsAwarded: 0 },
      { athleteId: 'ath-05', athleteName: 'Aryan Bhatia', house: 'ASHOKA', laneNumber: 5, finishTimeOrDistance: '11.82s', position: 5, pointsAwarded: 0 },
      { athleteId: 'ath-06', athleteName: 'Sahil Kapoor', house: 'TAGORE', laneNumber: 6, finishTimeOrDistance: '11.94s', position: 6, pointsAwarded: 0 },
      { athleteId: 'ath-07', athleteName: 'Manish Pandey', house: 'SHIVAJI', laneNumber: 7, finishTimeOrDistance: '12.01s', position: 7, pointsAwarded: 0 },
      { athleteId: 'ath-08', athleteName: 'Pranav Joshi', house: 'RAMAN', laneNumber: 8, finishTimeOrDistance: '12.18s', position: 8, pointsAwarded: 0 },
    ],
  },
  {
    id: 'heat-200m-01',
    eventId: 'ath-200m-sr',
    heatNumber: 1,
    heatLabel: 'Grand Final (Lanes 1 to 4)',
    isFinal: true,
    status: 'SCHEDULED',
    scheduledTime: '10:30 AM',
    athletes: [
      { athleteId: 'ath-g01', athleteName: 'Ananya Sen', admissionNo: 'ADM-2024-112', house: 'TAGORE', bibNumber: '201', laneNumber: 1, seedTime: '26.40s' },
      { athleteId: 'ath-g02', athleteName: 'Tanvi Saxena', admissionNo: 'ADM-2024-124', house: 'ASHOKA', bibNumber: '202', laneNumber: 2, seedTime: '26.10s' },
      { athleteId: 'ath-g03', athleteName: 'Riya Kulkarni', admissionNo: 'ADM-2024-135', house: 'SHIVAJI', bibNumber: '203', laneNumber: 3, seedTime: '25.95s' },
      { athleteId: 'ath-g04', athleteName: 'Meera Nambiar', admissionNo: 'ADM-2024-148', house: 'RAMAN', bibNumber: '204', laneNumber: 4, seedTime: '26.80s' },
    ],
  },
  {
    id: 'heat-relay-01',
    eventId: 'ath-4x100m-relay',
    heatNumber: 1,
    heatLabel: 'Championship Final (Inter-House)',
    isFinal: true,
    status: 'SCHEDULED',
    scheduledTime: '11:15 AM',
    athletes: [
      { athleteId: 'rel-ashoka', athleteName: 'Ashoka House Relay Squad', admissionNo: 'H-ASH', house: 'ASHOKA', bibNumber: 'R1', laneNumber: 2, seedTime: '46.80s' },
      { athleteId: 'rel-tagore', athleteName: 'Tagore House Relay Squad', admissionNo: 'H-TAG', house: 'TAGORE', bibNumber: 'R2', laneNumber: 3, seedTime: '46.20s' },
      { athleteId: 'rel-shivaji', athleteName: 'Shivaji House Relay Squad', admissionNo: 'H-SHV', house: 'SHIVAJI', bibNumber: 'R3', laneNumber: 4, seedTime: '45.90s' },
      { athleteId: 'rel-raman', athleteName: 'Raman House Relay Squad', admissionNo: 'H-RAM', house: 'RAMAN', bibNumber: 'R4', laneNumber: 5, seedTime: '47.10s' },
    ],
  },
];

/**
 * Initial Sports Shield Tallies
 */
export const INITIAL_SPORTS_TALLIES: Record<HouseName, { gold: number; silver: number; bronze: number; points: number }> = {
  SHIVAJI: { gold: 5, silver: 3, bronze: 4, points: 38 },
  ASHOKA: { gold: 4, silver: 4, bronze: 3, points: 35 },
  TAGORE: { gold: 3, silver: 5, bronze: 2, points: 32 },
  RAMAN: { gold: 2, silver: 3, bronze: 5, points: 24 },
};
