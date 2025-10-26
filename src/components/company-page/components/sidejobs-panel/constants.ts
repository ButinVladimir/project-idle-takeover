import { Feature, RewardParameter } from '@shared/index';

export const SIDEJOB_PARAMETERS = [
  RewardParameter.money,
  RewardParameter.developmentPoints,
  RewardParameter.experience,
  RewardParameter.influence,
  RewardParameter.connectivity,
  RewardParameter.codeBase,
  RewardParameter.computationalBase,
  RewardParameter.rewards,
  RewardParameter.processCompletionSpeedMultiplier,
  RewardParameter.sharedExperienceMultiplier,
];

interface ISidejobParameterValues {
  requirements: Feature[];
  isSpeed: boolean;
}

export const SIDEJOB_PARAMETER_VALUES: Record<RewardParameter, ISidejobParameterValues> = {
  [RewardParameter.money]: {
    requirements: [],
    isSpeed: true,
  },
  [RewardParameter.developmentPoints]: {
    requirements: [],
    isSpeed: true,
  },
  [RewardParameter.experience]: {
    requirements: [],
    isSpeed: true,
  },
  [RewardParameter.influence]: {
    requirements: [Feature.influence],
    isSpeed: true,
  },
  [RewardParameter.connectivity]: {
    requirements: [Feature.connectivity],
    isSpeed: true,
  },
  [RewardParameter.codeBase]: {
    requirements: [Feature.codeBase],
    isSpeed: true,
  },
  [RewardParameter.computationalBase]: {
    requirements: [Feature.computationalBase],
    isSpeed: true,
  },
  [RewardParameter.rewards]: {
    requirements: [Feature.rewards],
    isSpeed: true,
  },
  [RewardParameter.processCompletionSpeedMultiplier]: {
    requirements: [],
    isSpeed: false,
  },
  [RewardParameter.sharedExperienceMultiplier]: {
    requirements: [Feature.experienceShare],
    isSpeed: false,
  },
  [RewardParameter.actions]: {
    requirements: [],
    isSpeed: true,
  },
};
