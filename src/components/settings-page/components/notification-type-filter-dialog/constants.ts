import { msg } from '@lit/localize';
import { NotificationType } from '@shared/types';

export const NOTIFICATION_TYPE_NAMES: Record<NotificationType, () => string> = {
  [NotificationType.storyEvent]: () => msg('Story event'),
  [NotificationType.gameVersionUpdated]: () => msg('Game version updated'),
  [NotificationType.milestoneReached]: () => msg('New milestone reached'),
  [NotificationType.timeAccumulated]: () => msg('Time accumulated'),
  [NotificationType.activityUnlocked]: () => msg('Activity unlocked'),
  [NotificationType.designUnlocked]: () => msg('Design unlocked'),
  [NotificationType.factionsAvailable]: () => msg('Factions available'),
  [NotificationType.factionJoined]: () => msg('Faction joined'),
  [NotificationType.districtContested]: () => msg('District contested'),
  [NotificationType.districtCaptured]: () => msg('District captured'),
  [NotificationType.allMilestonesReached]: () => msg('All milestones reached'),
};
