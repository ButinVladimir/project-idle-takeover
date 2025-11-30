import { Attribute, IExponent, Skill, DistrictTypeRewardParameter, ITeamExponent } from '@shared/index';

export interface IContractTemplate {
  requirements: {
    baseCompletionTime: number;
    teamSize: {
      min: number;
      max: number;
    };
    connectivity: {
      amount: IExponent;
      threat: IExponent;
    };
    attributes: Record<Attribute, ITeamExponent | undefined>;
    skills: Record<Skill, ITeamExponent | undefined>;
  };
  rewardModifiers: {
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
  };
  rewards: Record<DistrictTypeRewardParameter, IExponent | undefined>;
}
