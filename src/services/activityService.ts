import { db } from '../db';
import { newId, nowIso } from '../utils/id';
import type { Activity } from '../types/entities';
import type { ActivityAction, EntityType } from '../constants/enums';

export async function logActivity(
  action: ActivityAction,
  entityType: EntityType,
  entityId: string,
  entityLabel: string,
): Promise<void> {
  const record: Activity = {
    id: newId(),
    action,
    entityType,
    entityId,
    entityLabel,
    timestamp: nowIso(),
  };
  await db.activities.add(record);
}

export async function recentActivity(limit = 15): Promise<Activity[]> {
  return db.activities.orderBy('timestamp').reverse().limit(limit).toArray();
}
