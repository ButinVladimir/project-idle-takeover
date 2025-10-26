import { Faction, Feature, MapSpecialEvent } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export interface IStoryEvent {
  requirements: {
    level?: number;
    faction?: Faction;
    capturedDistrictsCount?: number;
  };
  messages?: string[];
  unlockFeatures?: Feature[];
  rewardDesigns?: {
    programs?: ProgramName[];
    cloneTemplates?: string[];
  };
  unlockSidejobs?: string[];
  specialEvents?: MapSpecialEvent[];
}
