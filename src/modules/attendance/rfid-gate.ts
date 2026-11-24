export interface HardwarePunchEvent {
  id: string;
  machineId: string;
  badgeUid: string;
  personId: string;
  personName: string;
  personType: 'student' | 'staff';
  roleOrClass: string;
  direction: 'IN' | 'OUT';
  timestamp: string; // ISO
  punctualityStatus: 'ON_TIME' | 'LATE' | 'VERY_LATE' | 'EXITED';
  isDuplicatePassback: boolean;
}

export interface GateTurnstileStatus {
  totalInsideCampus: number;
  studentsInside: number;
  staffInside: number;
  turnstileState: 'LOCKED' | 'UNLOCKED' | 'PASSBACK_REJECTED';
  lastPunch?: HardwarePunchEvent;
}

/**
 * Evaluates punch time against school start time (08:00 AM)
 */
export function evaluatePunctuality(timeStr: string, direction: 'IN' | 'OUT'): 'ON_TIME' | 'LATE' | 'VERY_LATE' | 'EXITED' {
  if (direction === 'OUT') return 'EXITED';

  const date = new Date(timeStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // 08:00 AM = 480 minutes
  if (totalMinutes <= 480) {
    return 'ON_TIME';
  } else if (totalMinutes <= 510) {
    // 08:01 - 08:30 AM
    return 'LATE';
  } else {
    // After 08:30 AM
    return 'VERY_LATE';
  }
}

/**
 * Processes an incoming RFID badge or biometric punch with anti-passback debouncing (3 minutes)
 */
export function processGatePunch(
  machineId: string,
  badgeUid: string,
  person: { id: string; name: string; type: 'student' | 'staff'; roleOrClass: string },
  direction: 'IN' | 'OUT',
  timestamp: string,
  recentPunches: HardwarePunchEvent[]
): {
  event: HardwarePunchEvent;
  accepted: boolean;
  rejectReason?: string;
} {
  const currentMs = new Date(timestamp).getTime();

  // Check anti-passback within 180,000 ms (3 minutes)
  const recentDuplicate = recentPunches.find(
    (p) => p.badgeUid === badgeUid && currentMs - new Date(p.timestamp).getTime() < 180000
  );

  if (recentDuplicate) {
    const rejectedEvent: HardwarePunchEvent = {
      id: `punch-${Date.now()}`,
      machineId,
      badgeUid,
      personId: person.id,
      personName: person.name,
      personType: person.type,
      roleOrClass: person.roleOrClass,
      direction,
      timestamp,
      punctualityStatus: 'LATE',
      isDuplicatePassback: true,
    };
    return {
      event: rejectedEvent,
      accepted: false,
      rejectReason: `Anti-Passback Block: Card tapped again within 3 minutes (Last tap: ${new Date(recentDuplicate.timestamp).toLocaleTimeString()})`,
    };
  }

  const punctuality = evaluatePunctuality(timestamp, direction);

  const event: HardwarePunchEvent = {
    id: `punch-${Date.now()}`,
    machineId,
    badgeUid,
    personId: person.id,
    personName: person.name,
    personType: person.type,
    roleOrClass: person.roleOrClass,
    direction,
    timestamp,
    punctualityStatus: punctuality,
    isDuplicatePassback: false,
  };

  return {
    event,
    accepted: true,
  };
}

/**
 * Computes live campus muster roll headcount (people currently inside campus)
 */
export function computeCampusMusterRoll(punches: HardwarePunchEvent[]): {
  studentsInside: number;
  staffInside: number;
  totalInside: number;
} {
  const personState: Record<string, { type: 'student' | 'staff'; isInside: boolean }> = {};

  for (const p of punches) {
    if (p.isDuplicatePassback) continue;
    personState[p.personId] = {
      type: p.personType,
      isInside: p.direction === 'IN',
    };
  }

  let students = 0;
  let staff = 0;

  for (const s of Object.values(personState)) {
    if (s.isInside) {
      if (s.type === 'student') students++;
      else staff++;
    }
  }

  return {
    studentsInside: students,
    staffInside: staff,
    totalInside: students + staff,
  };
}
