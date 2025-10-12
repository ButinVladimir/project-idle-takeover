import { Attribute, Feature, IExponent, Skill } from '@shared/index';

export interface ISidejobTemplate {
  requirements: {
    connectivity: IExponent;
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
    requiredFeatures: Feature[];
  };
  rewardModifiers: {
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
  };
  rewards: {
    experience?: IExponent;
    money?: IExponent;
    developmentPoints?: IExponent;
    influence?: IExponent;
    codeBase?: IExponent;
    computationalBase?: IExponent;
    connectivity?: IExponent;
    rewards?: IExponent;
    processCompletionSpeed?: IExponent;
    experienceShareMultiplier?: IExponent;
  };
}
