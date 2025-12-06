import { DistrictTypeRewardParameter } from '@shared/index';
import { IContract } from '@state/activity-state';

export const checkContractParameterVisibility = (
  contract: IContract,
  parameter: DistrictTypeRewardParameter,
): boolean => {
  let value: any;

  switch (parameter) {
    case DistrictTypeRewardParameter.money:
      value = contract.contractTemplate.rewards.money;
      break;
    case DistrictTypeRewardParameter.developmentPoints:
      value = contract.contractTemplate.rewards.developmentPoints;
      break;
    case DistrictTypeRewardParameter.experience:
      value = contract.contractTemplate.rewards.experience;
      break;
    case DistrictTypeRewardParameter.influence:
      value = contract.contractTemplate.rewards.influence;
      break;
    case DistrictTypeRewardParameter.connectivity:
      value = contract.contractTemplate.rewards.connectivity;
      break;
    case DistrictTypeRewardParameter.codeBase:
      value = contract.contractTemplate.rewards.codeBase;
      break;
    case DistrictTypeRewardParameter.computationalBase:
      value = contract.contractTemplate.rewards.computationalBase;
      break;
    case DistrictTypeRewardParameter.rewards:
      value = contract.contractTemplate.rewards.rewards;
      break;
    default:
      return false;
  }

  return value !== undefined;
};
