import { Attribute, IExponent, Skill } from '@shared/index';
import { DistrictTypeRewardParameter } from '@state/city-state';

export interface ISidejobTemplate {
  requirements: {
    connectivity: IExponent;
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
  };
  rewardModifiers: {
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
  };
  rewards: Record<DistrictTypeRewardParameter, IExponent | undefined>;
}
