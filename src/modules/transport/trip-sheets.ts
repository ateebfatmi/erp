/**
 * School Bus Daily Trip Sheet, Fuel & Supreme Court Breathalyzer Engine
 * Statutory Compliance: Supreme Court of India School Bus Safety Guidelines,
 * Central Motor Vehicles Rules (CMVR) 1989, and RTO Transport Norms.
 */

export type TripShift = 'MORNING_PICKUP' | 'AFTERNOON_DROP' | 'SPECIAL_EXCURSION';
export type TripStatus = 'SCHEDULED' | 'DISPATCHED_ON_ROUTE' | 'COMPLETED_SAFE' | 'HELD_SAFETY_VIOLATION';
export type MileageHealth = 'OPTIMAL' | 'ACCEPTABLE' | 'LOW_EFFICIENCY_FLAGGED';

export interface TransportTripSheet {
  id: string;
  busId: string;
  registrationNo: string;
  routeNumber: string;
  shift: TripShift;
  tripDate: string; // YYYY-MM-DD
  driverName: string;
  conductorName: string;
  breathalyzerTest: 'PASS' | 'FAIL';
  odometerStartKm: number;
  odometerEndKm?: number;
  totalKmTravelled?: number;
  departureTime: string;
  actualArrivalTime?: string;
  studentsBoardedCount: number;
  busCapacity: number;
  status: TripStatus;
  safetyViolationReason?: string;
  driverFitnessVerifiedBy: string;
}

export interface FuelRefillLog {
  id: string;
  busId: string;
  registrationNo: string;
  refillDate: string;
  odometerKmAtRefill: number;
  litresFilled: number;
  pricePerLitre: number;
  totalFuelCost: number;
  fuelBunkBillNo: string;
  calculatedMileageKmPerLitre?: number;
  mileageHealthStatus: MileageHealth;
  driverSignOff: string;
}

export interface FleetFuelSummary {
  totalLitresFilled: number;
  totalExpenditure: number;
  averageMileageKmPerLitre: number;
  flaggedBusesCount: number;
}

/**
 * Dispatches a school bus trip sheet enforcing Supreme Court zero-tolerance breathalyzer checks
 */
export function dispatchTripSheet(params: {
  busId: string;
  registrationNo: string;
  routeNumber: string;
  shift: TripShift;
  tripDate: string;
  driverName: string;
  conductorName: string;
  breathalyzerTest: 'PASS' | 'FAIL';
  odometerStartKm: number;
  departureTime: string;
  studentsBoardedCount: number;
  busCapacity: number;
  driverFitnessVerifiedBy: string;
}): TransportTripSheet {
  const id = `TRIP-${params.tripDate.replace(/-/g, '')}-${params.busId}-${Date.now().toString().slice(-4)}`;

  if (params.breathalyzerTest === 'FAIL') {
    return {
      id,
      ...params,
      status: 'HELD_SAFETY_VIOLATION',
      safetyViolationReason: 'CRITICAL: Driver failed mandatory pre-trip breathalyzer alcohol test. Bus grounded immediately per Supreme Court safety rules.',
    };
  }

  if (params.studentsBoardedCount > params.busCapacity) {
    return {
      id,
      ...params,
      status: 'HELD_SAFETY_VIOLATION',
      safetyViolationReason: `Overloading Violation: ${params.studentsBoardedCount} students boarded exceeding licensed capacity of ${params.busCapacity} seats.`,
    };
  }

  return {
    id,
    ...params,
    status: 'DISPATCHED_ON_ROUTE',
  };
}

/**
 * Concludes a safe return trip and computes total odometer km
 */
export function concludeTripSheet(
  trip: TransportTripSheet,
  odometerEndKm: number,
  actualArrivalTime: string
): TransportTripSheet {
  if (trip.status === 'HELD_SAFETY_VIOLATION') {
    throw new Error('Cannot conclude a trip that was held for safety violations');
  }

  if (odometerEndKm < trip.odometerStartKm) {
    throw new Error('End odometer reading cannot be less than start odometer reading');
  }

  const totalKm = odometerEndKm - trip.odometerStartKm;

  return {
    ...trip,
    odometerEndKm,
    totalKmTravelled: totalKm,
    actualArrivalTime,
    status: 'COMPLETED_SAFE',
  };
}

/**
 * Logs diesel fuel refilling and automatically audits km/litre efficiency
 */
export function logFuelRefill(params: {
  busId: string;
  registrationNo: string;
  refillDate: string;
  odometerKmAtRefill: number;
  litresFilled: number;
  pricePerLitre: number;
  fuelBunkBillNo: string;
  driverSignOff: string;
  previousOdometerKm?: number;
}): FuelRefillLog {
  if (params.litresFilled <= 0) {
    throw new Error('Litres filled must be greater than zero');
  }

  const totalCost = Math.round(params.litresFilled * params.pricePerLitre);
  let mileage: number | undefined = undefined;
  let health: MileageHealth = 'OPTIMAL';

  if (params.previousOdometerKm && params.odometerKmAtRefill > params.previousOdometerKm) {
    const kmRun = params.odometerKmAtRefill - params.previousOdometerKm;
    mileage = Math.round((kmRun / params.litresFilled) * 10) / 10;

    if (mileage < 3.5) {
      health = 'LOW_EFFICIENCY_FLAGGED'; // Potential fuel theft or engine degradation
    } else if (mileage < 4.5) {
      health = 'ACCEPTABLE';
    } else {
      health = 'OPTIMAL';
    }
  }

  return {
    id: `FUEL-${Date.now().toString().slice(-6)}`,
    busId: params.busId,
    registrationNo: params.registrationNo,
    refillDate: params.refillDate,
    odometerKmAtRefill: params.odometerKmAtRefill,
    litresFilled: params.litresFilled,
    pricePerLitre: params.pricePerLitre,
    totalFuelCost: totalCost,
    fuelBunkBillNo: params.fuelBunkBillNo.trim(),
    calculatedMileageKmPerLitre: mileage,
    mileageHealthStatus: health,
    driverSignOff: params.driverSignOff,
  };
}

/**
 * Pre-seeded active trip sheets
 */
export const INITIAL_TRIP_SHEETS: TransportTripSheet[] = [
  {
    id: 'TRIP-20241124-BUS01-1042',
    busId: 'BUS-01',
    registrationNo: 'UP 16 BT 4410',
    routeNumber: 'Route 4 (Noida Sector 62 / Indirapuram)',
    shift: 'MORNING_PICKUP',
    tripDate: '2024-11-24',
    driverName: 'Sukhwinder Singh',
    conductorName: 'Manoj Kumar',
    breathalyzerTest: 'PASS',
    odometerStartKm: 42150,
    odometerEndKm: 42182,
    totalKmTravelled: 32,
    departureTime: '06:30 AM',
    actualArrivalTime: '07:45 AM',
    studentsBoardedCount: 38,
    busCapacity: 40,
    status: 'COMPLETED_SAFE',
    driverFitnessVerifiedBy: 'Security Officer R.P. Yadav',
  },
  {
    id: 'TRIP-20241124-BUS02-1043',
    busId: 'BUS-02',
    registrationNo: 'UP 16 BT 4412',
    routeNumber: 'Route 2 (Greater Noida Pari Chowk / Omega 1)',
    shift: 'AFTERNOON_DROP',
    tripDate: '2024-11-24',
    driverName: 'Harish Chandra',
    conductorName: 'Dinesh Prasad',
    breathalyzerTest: 'PASS',
    odometerStartKm: 38400,
    departureTime: '02:15 PM',
    studentsBoardedCount: 34,
    busCapacity: 40,
    status: 'DISPATCHED_ON_ROUTE',
    driverFitnessVerifiedBy: 'Security Officer R.P. Yadav',
  },
];

/**
 * Pre-seeded fuel refill logs
 */
export const INITIAL_FUEL_LOGS: FuelRefillLog[] = [
  {
    id: 'FUEL-99101',
    busId: 'BUS-01',
    registrationNo: 'UP 16 BT 4410',
    refillDate: '2024-11-20',
    odometerKmAtRefill: 42150,
    litresFilled: 65,
    pricePerLitre: 89.5,
    totalFuelCost: 5818,
    fuelBunkBillNo: 'IOCL-NOIDA-58912',
    calculatedMileageKmPerLitre: 4.8,
    mileageHealthStatus: 'OPTIMAL',
    driverSignOff: 'Sukhwinder Singh',
  },
  {
    id: 'FUEL-99102',
    busId: 'BUS-03',
    registrationNo: 'UP 16 BT 5520',
    refillDate: '2024-11-22',
    odometerKmAtRefill: 55420,
    litresFilled: 80,
    pricePerLitre: 89.5,
    totalFuelCost: 7160,
    fuelBunkBillNo: 'BPCL-EXPR-99410',
    calculatedMileageKmPerLitre: 3.1, // flagged low mileage
    mileageHealthStatus: 'LOW_EFFICIENCY_FLAGGED',
    driverSignOff: 'Rajesh Tyagi',
  },
];
