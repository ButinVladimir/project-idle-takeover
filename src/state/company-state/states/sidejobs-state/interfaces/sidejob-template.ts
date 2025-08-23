import { Attribute, Feature, IExponent, Skill } from '@shared/index';

export interface ISidejobTemplate {
  requirements: {
    connectivity: IExponent;
    attributes: Record<Attribute, IExponent>;
    skills: Record<Skill, IExponent>;
    requiredFeatures: Feature[];
  };
  rewardModifiers: {
    attributes: Record<Attribute, IExponent>;
    skills: Record<Skill, IExponent>;
  };
  rewards: {
    experience?: IExponent;
    money?: number;
    developmentPoints?: IExponent;
    distictTierPoints?: IExponent;
    codeBase?: number;
    computationalBase?: number;
    connectivity?: number;
    rewards?: number;
    processCompletionSpeed?: number;
  };
}
