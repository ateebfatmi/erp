import { describe, it, expect } from 'vitest';
import {
  calculateHostelOccupancy,
  canAllotBedInRoom,
  INITIAL_HOSTEL_WINGS,
  INITIAL_DORM_ROOMS,
  INITIAL_NIGHT_ROLL_CALL,
  STATUTORY_MESS_MENU,
} from '../hostel';

describe('Hostel & Residential Dormitory Management Engine', () => {
  it('calculates aggregate campus residential occupancy across wings', () => {
    const occ = calculateHostelOccupancy(INITIAL_HOSTEL_WINGS);

    expect(occ.totalBeds).toBe(225); // 120 + 105
    expect(occ.occupiedBeds).toBe(200); // 108 + 92
    expect(occ.occupancyPercentage).toBe(89); // 200/225 = 88.88% -> 89%
  });

  it('validates room bed capacity constraints correctly', () => {
    // Room 101 has 2 students with capacity of 3 -> Can allot bed
    const room101 = INITIAL_DORM_ROOMS[0];
    expect(canAllotBedInRoom(room101)).toBe(true);

    // Room 102 has 3 students with capacity of 3 -> Full, cannot allot bed
    const room102 = INITIAL_DORM_ROOMS[1];
    expect(canAllotBedInRoom(room102)).toBe(false);
  });

  it('manages night roll call states and mess dietary menu', () => {
    expect(INITIAL_NIGHT_ROLL_CALL.length).toBeGreaterThanOrEqual(4);

    const sickStudent = INITIAL_NIGHT_ROLL_CALL.find((r) => r.status === 'INFIRMARY_SICK');
    expect(sickStudent?.wardenRemarks).toContain('infirmary');

    const homePassStudent = INITIAL_NIGHT_ROLL_CALL.find((r) => r.status === 'HOME_PASS');
    expect(homePassStudent?.wardenRemarks).toContain('gate pass');

    expect(STATUTORY_MESS_MENU.length).toBeGreaterThan(0);
    expect(STATUTORY_MESS_MENU[0].caloriesKcal).toBeGreaterThanOrEqual(2000);
  });
});
