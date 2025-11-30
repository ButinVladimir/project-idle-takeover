import { COMMON_TEXTS } from '@texts/index';
import { AssignClonesContractDialogDescriptionMode } from './types';

export const DESCRIPTION_MODES = Object.values(AssignClonesContractDialogDescriptionMode);

export const DESCRIPTION_MODE_TEXTS = {
  [AssignClonesContractDialogDescriptionMode.requirements]: COMMON_TEXTS.requirements,
  [AssignClonesContractDialogDescriptionMode.rewards]: COMMON_TEXTS.rewards,
  [AssignClonesContractDialogDescriptionMode.rewardsMultipliers]: COMMON_TEXTS.rewardsMultipliers,
};
