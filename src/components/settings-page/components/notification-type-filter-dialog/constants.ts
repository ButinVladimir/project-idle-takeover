import { msg } from '@lit/localize';
import { NotificationType } from '@shared/types';

export const NOTIFICATION_TYPE_NAMES: Record<NotificationType, () => string> = {
  [NotificationType.storyEvent]: () => msg('Story event'),
  [NotificationType.gameVersionUpdated]: () => msg('Game version updated'),
  [NotificationType.featureUnlocked]: () => msg('New feature unlocked'),
  [NotificationType.timeAccumulated]: () => msg('Time accumulated'),
  [NotificationType.sidejobUnlocked]: () => msg('Sidejob unlocked'),
  [NotificationType.designUnlocked]: () => msg('Design unlocked'),
};
