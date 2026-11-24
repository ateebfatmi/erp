/**
 * Inter-House Sports & Co-Curricular Championship Hub
 * Manages annual Cock House athletic track meets, literary debates,
 * cultural festivals, Olympic medal tallies, and student house rosters.
 */

export type HouseName = 'ASHOKA' | 'TAGORE' | 'SHIVAJI' | 'RAMAN';

export type EventCategory = 'SPORTS' | 'LITERARY' | 'CULTURAL' | 'SCIENCE_TECH';

export interface HouseEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  venue: string;
  pointsSchedule: { first: number; second: number; third: number };
  status: 'SCHEDULED' | 'CONCLUDED';
  firstPlaceHouse?: HouseName;
  secondPlaceHouse?: HouseName;
  thirdPlaceHouse?: HouseName;
  studentHonorees?: string[];
}

export interface HouseMedalStanding {
  house: HouseName;
  gold: number;
  silver: number;
  bronze: number;
  totalMedals: number;
  aggregateScore: number; // Gold = 10, Silver = 7, Bronze = 5
  rank: number;
}

/**
 * Calculates official Olympic-style medal standings and weighted aggregate scores
 */
export function calculateMedalStandings(
  tallies: Record<HouseName, { gold: number; silver: number; bronze: number }>
): HouseMedalStanding[] {
  const houses: HouseName[] = ['ASHOKA', 'TAGORE', 'SHIVAJI', 'RAMAN'];

  const standings: HouseMedalStanding[] = houses.map((house) => {
    const t = tallies[house] || { gold: 0, silver: 0, bronze: 0 };
    const aggregateScore = t.gold * 10 + t.silver * 7 + t.bronze * 5;
    const totalMedals = t.gold + t.silver + t.bronze;

    return {
      house,
      gold: t.gold,
      silver: t.silver,
      bronze: t.bronze,
      totalMedals,
      aggregateScore,
      rank: 1,
    };
  });

  // Sort by aggregate score, then gold medals
  standings.sort((a, b) => {
    if (b.aggregateScore !== a.aggregateScore) {
      return b.aggregateScore - a.aggregateScore;
    }
    return b.gold - a.gold;
  });

  standings.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return standings;
}

/**
 * Concludes an event and calculates point distributions
 */
export function recordEventResult(
  event: HouseEvent,
  first: HouseName,
  second: HouseName,
  third: HouseName,
  studentHonorees: string[] = []
): {
  concludedEvent: HouseEvent;
  pointsAwarded: Record<HouseName, number>;
} {
  const pointsAwarded: Record<HouseName, number> = {
    ASHOKA: 0,
    TAGORE: 0,
    SHIVAJI: 0,
    RAMAN: 0,
  };

  pointsAwarded[first] = event.pointsSchedule.first;
  pointsAwarded[second] = event.pointsSchedule.second;
  pointsAwarded[third] = event.pointsSchedule.third;

  const concludedEvent: HouseEvent = {
    ...event,
    status: 'CONCLUDED',
    firstPlaceHouse: first,
    secondPlaceHouse: second,
    thirdPlaceHouse: third,
    studentHonorees,
  };

  return { concludedEvent, pointsAwarded };
}

/**
 * Curated Active Inter-House Events
 */
export const INITIAL_HOUSE_EVENTS: HouseEvent[] = [
  {
    id: 'evt-h01',
    title: 'Inter-House Senior Parliamentary Debate Championship',
    category: 'LITERARY',
    date: '2024-11-20',
    venue: 'Vivekananda Memorial Auditorium',
    pointsSchedule: { first: 50, second: 35, third: 20 },
    status: 'CONCLUDED',
    firstPlaceHouse: 'ASHOKA',
    secondPlaceHouse: 'TAGORE',
    thirdPlaceHouse: 'RAMAN',
    studentHonorees: ['Aarav Mehta (Best Speaker)', 'Tanvi Saxena (Best Interjector)'],
  },
  {
    id: 'evt-h02',
    title: 'Annual Inter-House Senior 4x100m Athletics Relay',
    category: 'SPORTS',
    date: '2024-11-28',
    venue: 'Main Synthetic Track & Stadium',
    pointsSchedule: { first: 60, second: 40, third: 25 },
    status: 'SCHEDULED',
  },
  {
    id: 'evt-h03',
    title: 'Inter-House Science & Robotics Innovation Hackathon',
    category: 'SCIENCE_TECH',
    date: '2024-12-05',
    venue: 'Atal Tinkering Laboratory (ATL)',
    pointsSchedule: { first: 50, second: 35, third: 20 },
    status: 'SCHEDULED',
  },
  {
    id: 'evt-h04',
    title: 'Inter-House Western Acoustic Band & Choir Symphony',
    category: 'CULTURAL',
    date: '2024-12-12',
    venue: 'Open Air Amphitheatre',
    pointsSchedule: { first: 50, second: 35, third: 20 },
    status: 'SCHEDULED',
  },
];

/**
 * Curated Initial Medal Tallies
 */
export const INITIAL_MEDAL_TALLIES: Record<HouseName, { gold: number; silver: number; bronze: number }> = {
  ASHOKA: { gold: 4, silver: 3, bronze: 2 }, // 40 + 21 + 10 = 71
  TAGORE: { gold: 3, silver: 5, bronze: 1 }, // 30 + 35 + 5 = 70
  SHIVAJI: { gold: 3, silver: 2, bronze: 4 }, // 30 + 14 + 20 = 64
  RAMAN: { gold: 2, silver: 2, bronze: 5 }, // 20 + 14 + 25 = 59
};
