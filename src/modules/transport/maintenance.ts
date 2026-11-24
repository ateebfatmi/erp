/**
 * Supreme Court Guidelines & State RTO Bus Fleet Compliance Engine
 * Enforces mandatory Indian school transport safety audits (Fitness Certificate,
 * PUC, Insurance, Speed Governor ≤ 40 km/h, CCTV, Fire Extinguishers)
 * and monitors fuel mileage telematics (km/L).
 */

export interface VehicleComplianceRecord {
  busId: string;
  busNumber: string;
  seatingCapacity: number;
  engineType: 'DIESEL' | 'CNG' | 'ELECTRIC';
  fitnessCertificateExpiry: string; // YYYY-MM-DD
  pucExpiry: string; // YYYY-MM-DD
  insuranceExpiry: string; // YYYY-MM-DD
  speedGovernorCertified: boolean; // Mandated max 40 km/h
  fireExtinguisherAuditDate: string; // YYYY-MM-DD
  firstAidAuditDate: string; // YYYY-MM-DD
  cctvFunctional: boolean;
  emergencyExitsVerified: boolean;
  currentOdometerKm: number;
}

export interface FuelLogEntry {
  id: string;
  busId: string;
  busNumber: string;
  date: string; // YYYY-MM-DD
  litersFilled: number;
  costPerLiter: number;
  totalCost: number;
  previousOdometerKm: number;
  currentOdometerKm: number;
  calculatedMileageKmPerL: number;
}

export interface FleetJobCard {
  id: string;
  busId: string;
  busNumber: string;
  serviceType: 'PREVENTIVE_MAINTENANCE' | 'BRAKE_OVERHAUL' | 'TYRE_ROTATION' | 'AC_COOLING_SERVICE';
  scheduledDate: string;
  estimatedCost: number;
  garageVendor: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

/**
 * Validates compliance against Supreme Court of India School Bus Safety Norms
 */
export function checkRtoComplianceStatus(
  vehicle: VehicleComplianceRecord,
  currentDate: string
): {
  isCompliant: boolean;
  criticalIssues: string[];
  daysToNextExpiry: number;
} {
  const criticalIssues: string[] = [];

  // Check Expiries
  if (vehicle.fitnessCertificateExpiry < currentDate) {
    criticalIssues.push(`Fitness Certificate EXPIRED on ${vehicle.fitnessCertificateExpiry}. Immediate RTO impound risk.`);
  }

  if (vehicle.pucExpiry < currentDate) {
    criticalIssues.push(`Pollution Under Control (PUC) certificate EXPIRED on ${vehicle.pucExpiry}.`);
  }

  if (vehicle.insuranceExpiry < currentDate) {
    criticalIssues.push(`Commercial vehicle insurance EXPIRED on ${vehicle.insuranceExpiry}.`);
  }

  // Safety Equipment Mandates
  if (!vehicle.speedGovernorCertified) {
    criticalIssues.push('Speed Governor not certified at 40 km/h cap (Violation of Supreme Court Order).');
  }

  if (!vehicle.cctvFunctional) {
    criticalIssues.push('Internal CCTV camera feed offline or defective.');
  }

  if (!vehicle.emergencyExitsVerified) {
    criticalIssues.push('Emergency rear exit door latch not certified in quarterly drill.');
  }

  // Calculate days to closest statutory expiry
  const now = new Date(currentDate).getTime();
  const fcDays = Math.ceil((new Date(vehicle.fitnessCertificateExpiry).getTime() - now) / (1000 * 3600 * 24));
  const pucDays = Math.ceil((new Date(vehicle.pucExpiry).getTime() - now) / (1000 * 3600 * 24));
  const insDays = Math.ceil((new Date(vehicle.insuranceExpiry).getTime() - now) / (1000 * 3600 * 24));

  const daysToNextExpiry = Math.min(fcDays, pucDays, insDays);

  return {
    isCompliant: criticalIssues.length === 0,
    criticalIssues,
    daysToNextExpiry,
  };
}

/**
 * Calculates aggregate fuel efficiency (km/L) and cost telemetry
 */
export function calculateFleetFuelEfficiency(logs: FuelLogEntry[]): {
  totalKmTraveled: number;
  totalFuelLiters: number;
  averageMileageKmPerL: number;
  totalExpenditure: number;
} {
  if (!logs || logs.length === 0) {
    return {
      totalKmTraveled: 0,
      totalFuelLiters: 0,
      averageMileageKmPerL: 0,
      totalExpenditure: 0,
    };
  }

  let totalKmTraveled = 0;
  let totalFuelLiters = 0;
  let totalExpenditure = 0;

  for (const log of logs) {
    const km = log.currentOdometerKm - log.previousOdometerKm;
    totalKmTraveled += Math.max(0, km);
    totalFuelLiters += log.litersFilled;
    totalExpenditure += log.totalCost;
  }

  const averageMileageKmPerL =
    totalFuelLiters > 0 ? Number((totalKmTraveled / totalFuelLiters).toFixed(2)) : 0;

  return {
    totalKmTraveled,
    totalFuelLiters,
    averageMileageKmPerL,
    totalExpenditure,
  };
}

/**
 * Curated Pre-seeded Fleet Compliance Data
 */
export const INITIAL_FLEET_RECORDS: VehicleComplianceRecord[] = [
  {
    busId: 'bus-01',
    busNumber: 'DL-01-GB-8842',
    seatingCapacity: 45,
    engineType: 'CNG',
    fitnessCertificateExpiry: '2025-06-30',
    pucExpiry: '2025-02-15',
    insuranceExpiry: '2025-08-20',
    speedGovernorCertified: true,
    fireExtinguisherAuditDate: '2024-11-01',
    firstAidAuditDate: '2024-11-01',
    cctvFunctional: true,
    emergencyExitsVerified: true,
    currentOdometerKm: 68420,
  },
  {
    busId: 'bus-02',
    busNumber: 'DL-01-GB-7719',
    seatingCapacity: 40,
    engineType: 'DIESEL',
    fitnessCertificateExpiry: '2024-10-15', // EXPIRED!
    pucExpiry: '2025-01-10',
    insuranceExpiry: '2025-04-12',
    speedGovernorCertified: true,
    fireExtinguisherAuditDate: '2024-10-01',
    firstAidAuditDate: '2024-10-01',
    cctvFunctional: false, // DEFECTIVE!
    emergencyExitsVerified: true,
    currentOdometerKm: 94100,
  },
  {
    busId: 'bus-03',
    busNumber: 'UP-16-BT-9102',
    seatingCapacity: 52,
    engineType: 'CNG',
    fitnessCertificateExpiry: '2025-09-10',
    pucExpiry: '2025-03-22',
    insuranceExpiry: '2025-05-18',
    speedGovernorCertified: true,
    fireExtinguisherAuditDate: '2024-11-10',
    firstAidAuditDate: '2024-11-10',
    cctvFunctional: true,
    emergencyExitsVerified: true,
    currentOdometerKm: 42150,
  },
];

/**
 * Curated Fuel Mileage Logs
 */
export const INITIAL_FUEL_LOGS: FuelLogEntry[] = [
  {
    id: 'fl-01',
    busId: 'bus-01',
    busNumber: 'DL-01-GB-8842',
    date: '2024-11-20',
    litersFilled: 48,
    costPerLiter: 89.5,
    totalCost: 4296,
    previousOdometerKm: 68150,
    currentOdometerKm: 68420,
    calculatedMileageKmPerL: 5.62, // 270 km / 48 L = 5.62 km/L
  },
  {
    id: 'fl-02',
    busId: 'bus-03',
    busNumber: 'UP-16-BT-9102',
    date: '2024-11-22',
    litersFilled: 60,
    costPerLiter: 89.5,
    totalCost: 5370,
    previousOdometerKm: 41820,
    currentOdometerKm: 42150,
    calculatedMileageKmPerL: 5.5, // 330 km / 60 L = 5.5 km/L
  },
];

/**
 * Curated Service Job Cards
 */
export const INITIAL_SERVICE_CARDS: FleetJobCard[] = [
  {
    id: 'jc-01',
    busId: 'bus-02',
    busNumber: 'DL-01-GB-7719',
    serviceType: 'BRAKE_OVERHAUL',
    scheduledDate: '2024-11-28',
    estimatedCost: 14500,
    garageVendor: 'Tata Commercial Authorised Workshop, Okhla',
    status: 'SCHEDULED',
  },
  {
    id: 'jc-02',
    busId: 'bus-01',
    busNumber: 'DL-01-GB-8842',
    serviceType: 'TYRE_ROTATION',
    scheduledDate: '2024-12-05',
    estimatedCost: 4800,
    garageVendor: 'Apollo Commercial Fleet Center, Noida',
    status: 'SCHEDULED',
  },
];
