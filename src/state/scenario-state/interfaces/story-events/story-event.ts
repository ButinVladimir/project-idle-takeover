import { CloneTemplateName, SidejobName } from '@state/company-state';
import { Feature } from '@shared/index';
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
}
