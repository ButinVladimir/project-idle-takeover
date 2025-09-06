import { CloneTemplateName, SidejobName } from '@state/company-state';
import { Feature } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

interface IRewardProgramEvent {
  name: ProgramName;
  tier: number;
}

interface IRewardCloneTemplate {
  name: CloneTemplateName;
  tier: number;
}

export interface IStoryEvent {
  key: string;
  level: number;
  unlockFeatures?: Feature[];
  messages?: string[];
  rewardDesigns?: {
    programs?: IRewardProgramEvent[];
    cloneTemplates?: IRewardCloneTemplate[];
  }
  unlockSidejobs?: SidejobName[];
}
