import { COMMON_TEXTS } from '@texts/index';
import { AssignCloneSidejobDialogDescriptionMode } from './types';

export const DESCRIPTION_MODES = Object.values(AssignCloneSidejobDialogDescriptionMode);

export const DESCRIPTION_MODE_TEXTS = {
  [AssignCloneSidejobDialogDescriptionMode.requirements]: COMMON_TEXTS.requirements,
  [AssignCloneSidejobDialogDescriptionMode.rewards]: COMMON_TEXTS.rewards,
  [AssignCloneSidejobDialogDescriptionMode.rewardsMultipliers]: COMMON_TEXTS.rewardsMultipliers,
};
