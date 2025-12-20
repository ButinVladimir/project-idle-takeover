import { Milestone, MapSpecialEvent } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export interface IStoryEvent {
  requirements: {
    level?: number;
    faction?: string;
    capturedDistrictsCount?: number;
  };
  messages?: string[];
  milestones?: Milestone[];
  rewardDesigns?: {
    programs?: ProgramName[];
    cloneTemplates?: string[];
  };
  unlockActivities?: {
    sidejobs?: string[];
    contracts?: string[];
  };
  specialEvents?: MapSpecialEvent[];
}
