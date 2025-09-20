import { CloneTemplateName, SidejobName } from '@state/company-state';
import { Feature, MapSpecialEvent } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export interface IStoryEvent {
  key: string;
  level: number;
  messages?: string[];
  unlockFeatures?: Feature[];
  rewardDesigns?: {
    programs?: ProgramName[];
    cloneTemplates?: CloneTemplateName[];
  };
  unlockSidejobs?: SidejobName[];
  specialEvents?: MapSpecialEvent[];
}
