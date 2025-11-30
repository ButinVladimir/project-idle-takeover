import { DistrictTypeRewardParameter, MS_IN_SECOND } from '@shared/index';
import { ISidejob } from '@state/activity-state';

export const calculateSidejobParameterValue = (sidejob: ISidejob, parameter: DistrictTypeRewardParameter) => {
  return sidejob.calculateParameterDelta(parameter, MS_IN_SECOND);
};

export const checkSidejobParameterVisibility = (sidejob: ISidejob, parameter: DistrictTypeRewardParameter): boolean => {
  let value: any;

  switch (parameter) {
    case DistrictTypeRewardParameter.money:
      value = sidejob.sidejobTemplate.rewards.money;
      break;
    case DistrictTypeRewardParameter.developmentPoints:
      value = sidejob.sidejobTemplate.rewards.developmentPoints;
      break;
    case DistrictTypeRewardParameter.experience:
      value = sidejob.sidejobTemplate.rewards.experience;
      break;
    case DistrictTypeRewardParameter.influence:
      value = sidejob.sidejobTemplate.rewards.influence;
      break;
    case DistrictTypeRewardParameter.connectivity:
      value = sidejob.sidejobTemplate.rewards.connectivity;
      break;
    case DistrictTypeRewardParameter.codeBase:
      value = sidejob.sidejobTemplate.rewards.codeBase;
      break;
    case DistrictTypeRewardParameter.computationalBase:
      value = sidejob.sidejobTemplate.rewards.computationalBase;
      break;
    case DistrictTypeRewardParameter.rewards:
      value = sidejob.sidejobTemplate.rewards.rewards;
      break;
    case DistrictTypeRewardParameter.processCompletionSpeed:
      value = sidejob.sidejobTemplate.rewards.processCompletionSpeed;
      break;
    case DistrictTypeRewardParameter.experienceShareMultiplier:
      value = sidejob.sidejobTemplate.rewards.experienceShareMultiplier;
      break;
    default:
      return false;
  }

  return value !== undefined;
};
