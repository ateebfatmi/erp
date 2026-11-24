/**
 * Commercial Hostel & Residential Dormitory Management Engine
 * Manages dormitory wings, bed allocations, night roll call curfews,
 * weekend home outing gate passes, and dietary mess management.
 */

export interface HostelWing {
  id: string;
  name: string;
  genderType: 'BOYS' | 'GIRLS';
  wardenName: string;
  wardenPhone: string;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
}

export interface DormRoom {
  id: string;
  wingId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  allottedStudents: {
    studentId: string;
    studentName: string;
    classSection: string;
    bedNumber: number;
  }[];
}

export type RollCallStatus = 'PRESENT' | 'ABSENT' | 'INFIRMARY_SICK' | 'HOME_PASS';

export interface NightRollCallRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  roomNumber: string;
  status: RollCallStatus;
  checkInTime: string; // e.g. "21:30"
  wardenRemarks?: string;
}

export interface MessDietarySchedule {
  dayOfWeek: string;
  breakfast: string;
  lunch: string;
  eveningSnacks: string;
  dinner: string;
  caloriesKcal: number;
}

/**
 * Calculates dormitory occupancy percentages across campus residential wings
 */
export function calculateHostelOccupancy(wings: HostelWing[]): {
  totalBeds: number;
  occupiedBeds: number;
  occupancyPercentage: number;
} {
  if (!wings || wings.length === 0) {
    return { totalBeds: 0, occupiedBeds: 0, occupancyPercentage: 0 };
  }

  const totalBeds = wings.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = wings.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return { totalBeds, occupiedBeds, occupancyPercentage };
}

/**
 * Validates room capacity constraints prior to bed allotment
 */
export function canAllotBedInRoom(room: DormRoom): boolean {
  return room.allottedStudents.length < room.capacity;
}

/**
 * Curated Pre-seeded Hostel Wings
 */
export const INITIAL_HOSTEL_WINGS: HostelWing[] = [
  {
    id: 'wing-01',
    name: 'Tagore Bhawan (Senior Boys Dormitory)',
    genderType: 'BOYS',
    wardenName: 'Col. K. S. Rathore (Retd.)',
    wardenPhone: '+91 98101 22334',
    totalRooms: 40,
    totalBeds: 120,
    occupiedBeds: 108,
  },
  {
    id: 'wing-02',
    name: 'Sarojini Bhawan (Senior Girls Dormitory)',
    genderType: 'GIRLS',
    wardenName: 'Dr. Meenakshi Sundaram',
    wardenPhone: '+91 98202 33445',
    totalRooms: 35,
    totalBeds: 105,
    occupiedBeds: 92,
  },
];

/**
 * Curated Dormitory Rooms
 */
export const INITIAL_DORM_ROOMS: DormRoom[] = [
  {
    id: 'rm-101',
    wingId: 'wing-01',
    roomNumber: 'T-101',
    floor: 1,
    capacity: 3,
    allottedStudents: [
      { studentId: 'std-101', studentName: 'Aarav Mehta', classSection: '12-A', bedNumber: 1 },
      { studentId: 'std-102', studentName: 'Kabir Khan', classSection: '12-A', bedNumber: 2 },
    ],
  },
  {
    id: 'rm-102',
    wingId: 'wing-01',
    roomNumber: 'T-102',
    floor: 1,
    capacity: 3,
    allottedStudents: [
      { studentId: 'std-103', studentName: 'Rohan Sharma', classSection: '11-B', bedNumber: 1 },
      { studentId: 'std-104', studentName: 'Aditya Birla', classSection: '11-B', bedNumber: 2 },
      { studentId: 'std-105', studentName: 'Devansh Roy', classSection: '11-B', bedNumber: 3 },
    ],
  },
];

/**
 * Curated Night Roll Call Records
 */
export const INITIAL_NIGHT_ROLL_CALL: NightRollCallRecord[] = [
  {
    id: 'rc-01',
    date: '2024-11-24',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    roomNumber: 'T-101',
    status: 'PRESENT',
    checkInTime: '21:15',
  },
  {
    id: 'rc-02',
    date: '2024-11-24',
    studentId: 'std-102',
    studentName: 'Kabir Khan',
    roomNumber: 'T-101',
    status: 'PRESENT',
    checkInTime: '21:20',
  },
  {
    id: 'rc-03',
    date: '2024-11-24',
    studentId: 'std-103',
    studentName: 'Rohan Sharma',
    roomNumber: 'T-102',
    status: 'INFIRMARY_SICK',
    checkInTime: '20:45',
    wardenRemarks: 'Admitted to campus infirmary with low-grade pyrexia.',
  },
  {
    id: 'rc-04',
    date: '2024-11-24',
    studentId: 'std-104',
    studentName: 'Aditya Birla',
    roomNumber: 'T-102',
    status: 'HOME_PASS',
    checkInTime: '—',
    wardenRemarks: 'Authorized weekend guardian gate pass sanctioned.',
  },
];

/**
 * Curated Institutional Mess Nutrition Menu
 */
export const STATUTORY_MESS_MENU: MessDietarySchedule[] = [
  {
    dayOfWeek: 'Monday',
    breakfast: 'Poha with Roasted Peanuts, Boiled Eggs / Banana, Milk, Tea',
    lunch: 'Shahi Paneer / Chicken Curry, Dal Tadka, Seasonal Veg, Steamed Basmati Rice, Chapati, Salad',
    eveningSnacks: 'Vegetable Cutlet, Green Mint Chutney, Hot Masala Tea',
    dinner: 'Aloo Gobhi Adraki, Mixed Dal Fry, Phulka Roti, Jeera Rice, Gulab Jamun',
    caloriesKcal: 2450,
  },
  {
    dayOfWeek: 'Tuesday',
    breakfast: 'Idli Sambar, Coconut Chutney, Sprouted Moong, Milk, Coffee',
    lunch: 'Rajma Masala (Kashmiri), Kadhi Pakora, Jeera Rice, Tawa Roti, Boondi Raita',
    eveningSnacks: 'Samosa / Puffs, Filter Coffee / Tea',
    dinner: 'Paneer Butter Masala, Yellow Moong Dal, Naan & Roti, Pulao, Fruit Custard',
    caloriesKcal: 2380,
  },
];
