import { DistrictTypeRewardParameter, MS_IN_SECOND } from '@shared/index';
import { ISidejob } from '@state/activity-state';

export const calculateSidejobParameterValue = (sidejob: ISidejob, parameter: DistrictTypeRewardParameter) => {
  return sidejob.calculateParameterDelta(parameter, MS_IN_SECOND);
};
