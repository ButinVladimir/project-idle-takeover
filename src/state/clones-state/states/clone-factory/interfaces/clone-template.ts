import { IExponent, ITierExponent, ITierLinear, Attribute, Skill } from '@shared/index';

export interface ICloneTemplate {
  cost: ITierExponent;
  synchronization: {
    multiplier: number;
    baseTier: number;
  };
  experienceMultiplier: ITierLinear;
  levelRequirements: IExponent;
  attributes: Record<Attribute, ITierLinear>;
  skills: Record<Skill, ITierLinear>;
}
