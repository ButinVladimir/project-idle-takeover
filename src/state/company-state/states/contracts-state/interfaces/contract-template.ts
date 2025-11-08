import { Attribute, IExponent, Skill } from '@shared/index';

export interface IContractTemplate {
  requirements: {
    baseCompletionTime: number;
    teamSize: {
      min: number;
      max: number;
    };
    connectivity: IExponent;
    attributes: Record<Attribute, IExponent | undefined>;
    skills: Record<Skill, IExponent | undefined>;
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
  };
}
