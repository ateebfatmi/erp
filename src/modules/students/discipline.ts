/**
 * Student Pastoral Care, Behavioral Incident & House Cup Merit Engine
 * Implements CBSE positive behavior reinforcement, restorative discipline tracking,
 * multi-tier parent escalation, and House Points championship leaderboard.
 */

export type HouseName = 'ASHOKA' | 'TAGORE' | 'SHIVAJI' | 'RAMAN';

export type IncidentType = 'MERIT' | 'DEMERIT';

export type MeritCategory =
  | 'ACADEMIC_EXCELLENCE'
  | 'COMMUNITY_SERVICE'
  | 'SPORTSMANSHIP'
  | 'CREATIVE_ARTS'
  | 'CIVIC_LEADERSHIP';

export type DemeritSeverity =
  | 'LEVEL_1_VERBAL_WARNING'
  | 'LEVEL_2_COUNSELOR_INTERVENTION'
  | 'LEVEL_3_PARENT_CONFERENCE'
  | 'LEVEL_4_DISCIPLINARY_COMMITTEE';

export interface BehaviorRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classSection: string;
  house: HouseName;
  incidentType: IncidentType;
  category: string;
  points: number; // Positive for merit, negative for demerit
  severity?: DemeritSeverity;
  date: string; // YYYY-MM-DD
  reportedBy: string;
  description: string;
  restorativeAction: string;
  parentNotified: boolean;
}

export interface HouseStanding {
  house: HouseName;
  colorHex: string;
  totalPoints: number;
  meritsCount: number;
  demeritsCount: number;
  rank: number;
}

export const HOUSE_COLORS: Record<HouseName, string> = {
  ASHOKA: '#2563EB', // Blue
  TAGORE: '#16A34A', // Green
  SHIVAJI: '#DC2626', // Red
  RAMAN: '#D97706', // Gold / Amber
};

/**
 * Calculates real-time House Cup standings across positive merits and demerits
 */
export function calculateHouseStandings(
  records: BehaviorRecord[],
  basePoints = 1000
): HouseStanding[] {
  const tally: Record<HouseName, { points: number; merits: number; demerits: number }> = {
    ASHOKA: { points: basePoints, merits: 0, demerits: 0 },
    TAGORE: { points: basePoints, merits: 0, demerits: 0 },
    SHIVAJI: { points: basePoints, merits: 0, demerits: 0 },
    RAMAN: { points: basePoints, merits: 0, demerits: 0 },
  };

  for (const r of records) {
    if (tally[r.house]) {
      tally[r.house].points += r.points;
      if (r.incidentType === 'MERIT') tally[r.house].merits++;
      if (r.incidentType === 'DEMERIT') tally[r.house].demerits++;
    }
  }

  const houses: HouseName[] = ['ASHOKA', 'TAGORE', 'SHIVAJI', 'RAMAN'];
  const standings: HouseStanding[] = houses.map((house) => ({
    house,
    colorHex: HOUSE_COLORS[house],
    totalPoints: tally[house].points,
    meritsCount: tally[house].merits,
    demeritsCount: tally[house].demerits,
    rank: 1,
  }));

  // Sort descending by total points
  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return standings;
}

/**
 * Computes individual student behavioral net score
 */
export function getStudentDisciplineSummary(
  studentId: string,
  records: BehaviorRecord[]
): {
  totalMeritPoints: number;
  totalDemeritPoints: number;
  netScore: number;
  incidentCount: number;
} {
  const studentRecords = records.filter((r) => r.studentId === studentId);

  let totalMeritPoints = 0;
  let totalDemeritPoints = 0;

  for (const r of studentRecords) {
    if (r.incidentType === 'MERIT') {
      totalMeritPoints += r.points;
    } else {
      totalDemeritPoints += Math.abs(r.points);
    }
  }

  return {
    totalMeritPoints,
    totalDemeritPoints,
    netScore: totalMeritPoints - totalDemeritPoints,
    incidentCount: studentRecords.length,
  };
}

/**
 * Filters behavioral incidents by house, type, or student query
 */
export function filterBehaviorRecords(
  records: BehaviorRecord[],
  houseFilter?: HouseName | 'ALL',
  typeFilter?: IncidentType | 'ALL',
  query = ''
): BehaviorRecord[] {
  const q = query.trim().toLowerCase();

  return records.filter((r) => {
    const matchesHouse = !houseFilter || houseFilter === 'ALL' || r.house === houseFilter;
    const matchesType = !typeFilter || typeFilter === 'ALL' || r.incidentType === typeFilter;

    if (!matchesHouse || !matchesType) return false;
    if (!q) return true;

    return (
      r.studentName.toLowerCase().includes(q) ||
      r.rollNo.toLowerCase().includes(q) ||
      r.classSection.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });
}

/**
 * Pre-seeded Behavioral and Pastoral Records
 */
export const INITIAL_BEHAVIOR_RECORDS: BehaviorRecord[] = [
  {
    id: 'beh-01',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    rollNo: '24',
    classSection: '12-A',
    house: 'ASHOKA',
    incidentType: 'MERIT',
    category: 'ACADEMIC_EXCELLENCE',
    points: 25,
    date: '2024-11-20',
    reportedBy: 'Smt. Ananya Sen (PGT Math)',
    description: 'Secured 1st rank in Inter-School Senior Mathematics Olympiad Regional Prelims.',
    restorativeAction: 'Awarded Certificate of Honor at Morning Assembly and 25 House Points.',
    parentNotified: true,
  },
  {
    id: 'beh-02',
    studentId: 'std-102',
    studentName: 'Kabir Khan',
    rollNo: '04',
    classSection: '12-A',
    house: 'TAGORE',
    incidentType: 'MERIT',
    category: 'SPORTSMANSHIP',
    points: 20,
    date: '2024-11-18',
    reportedBy: 'Shri Vikram Rathore (Director PE)',
    description: 'Captained the Senior Football Team to semi-finals victory; displayed exemplary fair play.',
    restorativeAction: 'Recognized with Sports Star of the Month citation.',
    parentNotified: true,
  },
  {
    id: 'beh-03',
    studentId: 'std-105',
    studentName: 'Devansh Roy',
    rollNo: '12',
    classSection: '11-B',
    house: 'SHIVAJI',
    incidentType: 'DEMERIT',
    category: 'UNIFORM_NON_COMPLIANCE',
    points: -5,
    severity: 'LEVEL_1_VERBAL_WARNING',
    date: '2024-11-22',
    reportedBy: 'Discipline Prefect',
    description: 'Reporting without official school winter blazer on three consecutive days.',
    restorativeAction: 'Verbal warning recorded; student reminded of CBSE winter uniform guidelines.',
    parentNotified: false,
  },
  {
    id: 'beh-04',
    studentId: 'std-106',
    studentName: 'Rohan Sharma',
    rollNo: '18',
    classSection: '11-A',
    house: 'RAMAN',
    incidentType: 'MERIT',
    category: 'COMMUNITY_SERVICE',
    points: 30,
    date: '2024-11-15',
    reportedBy: 'Social Service Club Mentor',
    description: 'Organized weekend campus e-waste recycling and clean energy drive.',
    restorativeAction: 'Appointed as Green Campus Student Ambassador.',
    parentNotified: true,
  },
  {
    id: 'beh-05',
    studentId: 'std-107',
    studentName: 'Varun Grover',
    rollNo: '29',
    classSection: '10-B',
    house: 'SHIVAJI',
    incidentType: 'DEMERIT',
    category: 'CLASSROOM_DISRUPTION',
    points: -15,
    severity: 'LEVEL_2_COUNSELOR_INTERVENTION',
    date: '2024-11-12',
    reportedBy: 'Dr. V. K. Saxena (PGT Chemistry)',
    description: 'Repeatedly interrupting peer laboratory experiments during titration practicals.',
    restorativeAction: 'One-on-one session with School Counselor on lab safety & peer collaboration.',
    parentNotified: true,
  },
];
