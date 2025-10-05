import { MS_IN_SECOND, RewardParameter } from '@shared/index';
import { ISidejob } from '@state/company-state';

export const calculateSidejobParameterValue = (sidejob: ISidejob, parameter: RewardParameter) => {
  switch (parameter) {
    case RewardParameter.money:
      return sidejob.calculateMoneyDelta(MS_IN_SECOND);
    case RewardParameter.developmentPoints:
      return sidejob.calculateDevelopmentPointsDelta(MS_IN_SECOND);
    case RewardParameter.experience:
      return sidejob.calculateExperienceDelta(MS_IN_SECOND);
    case RewardParameter.influence:
      return sidejob.calculateInfluenceDelta(MS_IN_SECOND);
    case RewardParameter.connectivity:
      return sidejob.calculateConnectivityDelta(MS_IN_SECOND);
    case RewardParameter.codeBase:
      return sidejob.calculateCodeBaseDelta(MS_IN_SECOND);
    case RewardParameter.computationalBase:
      return sidejob.calculateComputationalBaseDelta(MS_IN_SECOND);
    case RewardParameter.rewards:
      return sidejob.calculateRewardsDelta(MS_IN_SECOND);
    case RewardParameter.processCompletionSpeedMultiplier:
      return sidejob.calculateProcessCompletionSpeedDelta();
    case RewardParameter.sharedExperienceMultiplier:
      return sidejob.calculateExperienceShareMultiplierDelta();
    default:
      return 0;
  }
};

export const checkSidejobParameterVisibility = (sidejob: ISidejob, parameter: RewardParameter): boolean => {
  let value: any;

  switch (parameter) {
    case RewardParameter.money:
      value = sidejob.sidejobTemplate.rewards.money;
      break;
    case RewardParameter.developmentPoints:
      value = sidejob.sidejobTemplate.rewards.developmentPoints;
      break;
    case RewardParameter.experience:
      value = sidejob.sidejobTemplate.rewards.experience;
      break;
    case RewardParameter.influence:
      value = sidejob.sidejobTemplate.rewards.influence;
      break;
    case RewardParameter.connectivity:
      value = sidejob.sidejobTemplate.rewards.connectivity;
      break;
    case RewardParameter.codeBase:
      value = sidejob.sidejobTemplate.rewards.codeBase;
      break;
    case RewardParameter.computationalBase:
      value = sidejob.sidejobTemplate.rewards.computationalBase;
      break;
    case RewardParameter.rewards:
      value = sidejob.sidejobTemplate.rewards.rewards;
      break;
    case RewardParameter.processCompletionSpeedMultiplier:
      value = sidejob.sidejobTemplate.rewards.processCompletionSpeed;
      break;
    case RewardParameter.sharedExperienceMultiplier:
      value = sidejob.sidejobTemplate.rewards.experienceShareMultiplier;
      break;
    default:
      return false;
  }

  return !!value;
};
