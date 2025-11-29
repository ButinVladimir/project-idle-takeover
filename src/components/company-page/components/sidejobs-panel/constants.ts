import { DistrictTypeRewardParameter, Feature } from '@shared/index';

interface ISidejobParameterValues {
  requirements: Feature[];
  isSpeed: boolean;
}

export const SIDEJOB_PARAMETER_VALUES: Record<DistrictTypeRewardParameter, ISidejobParameterValues> = {
  [DistrictTypeRewardParameter.money]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.developmentPoints]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.experience]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.influence]: {
    requirements: [Feature.influence],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.connectivity]: {
    requirements: [Feature.connectivity],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.codeBase]: {
    requirements: [Feature.codeBase],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.computationalBase]: {
    requirements: [Feature.computationalBase],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.rewards]: {
    requirements: [Feature.rewards],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.processCompletionSpeed]: {
    requirements: [],
    isSpeed: false,
  },
  [DistrictTypeRewardParameter.experienceShareMultiplier]: {
    requirements: [Feature.experienceShare],
    isSpeed: false,
  },
};
