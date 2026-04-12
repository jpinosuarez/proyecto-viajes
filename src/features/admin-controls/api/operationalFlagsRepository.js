import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@shared/firebase';

const OPERATIONAL_FLAGS_REF = doc(db, 'system', 'operational_flags');
const MIN_LEVEL = 0;
const MAX_LEVEL = 4;

const coerceLevel = (rawLevel) => {
  const parsed = Number(rawLevel);
  if (!Number.isInteger(parsed) || parsed < MIN_LEVEL || parsed > MAX_LEVEL) {
    throw new Error(`Invalid operational level: ${rawLevel}`);
  }
  return parsed;
};

export const buildOperationalFlagsPayload = ({ level, updatedByUid, reason }) => {
  const safeLevel = coerceLevel(level);

  return {
    level: safeLevel,
    app_readonly_mode: safeLevel >= 3,
    app_maintenance_mode: safeLevel >= 4,
    updated_by: updatedByUid || null,
    updated_at: serverTimestamp(),
    reason: reason || `Updated from in-app controls to level ${safeLevel}`,
  };
};

export const updateOperationalFlagsLevel = async ({ level, updatedByUid, reason }) => {
  const payload = buildOperationalFlagsPayload({ level, updatedByUid, reason });
  await setDoc(OPERATIONAL_FLAGS_REF, payload, { merge: true });
  return payload;
};
