import { describe, it, expect } from 'vitest';
import {
  calculateMedalStandings,
  recordEventResult,
  INITIAL_MEDAL_TALLIES,
  INITIAL_HOUSE_EVENTS,
} from '../house-system';

describe('Inter-House Sports & Co-Curricular Championship Hub', () => {
  it('calculates official Olympic-style medal standings and points correctly', () => {
    const standings = calculateMedalStandings(INITIAL_MEDAL_TALLIES);

    expect(standings.length).toBe(4);
    expect(standings[0].rank).toBe(1);
    expect(standings[0].house).toBe('ASHOKA');
    expect(standings[0].aggregateScore).toBe(71); // 4*10 + 3*7 + 2*5 = 40 + 21 + 10 = 71

    expect(standings[1].house).toBe('TAGORE');
    expect(standings[1].aggregateScore).toBe(70); // 3*10 + 5*7 + 1*5 = 30 + 35 + 5 = 70

    expect(standings[3].house).toBe('RAMAN');
    expect(standings[3].rank).toBe(4);
  });

  it('records event results and distributes points to podium houses', () => {
    const relayEvent = INITIAL_HOUSE_EVENTS[1]; // Relay points: { first: 60, second: 40, third: 25 }

    const { concludedEvent, pointsAwarded } = recordEventResult(
      relayEvent,
      'SHIVAJI',
      'ASHOKA',
      'TAGORE',
      ['Devansh Roy (Anchor Leg)']
    );

    expect(concludedEvent.status).toBe('CONCLUDED');
    expect(concludedEvent.firstPlaceHouse).toBe('SHIVAJI');
    expect(pointsAwarded.SHIVAJI).toBe(60);
    expect(pointsAwarded.ASHOKA).toBe(40);
    expect(pointsAwarded.TAGORE).toBe(25);
    expect(pointsAwarded.RAMAN).toBe(0);
    expect(concludedEvent.studentHonorees).toContain('Devansh Roy (Anchor Leg)');
  });
});
