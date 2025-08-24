import { Attribute, Skill } from '@shared/types';
import { CloneTemplateName } from '../types';
import { IMakeCloneParameters } from './make-clone-parameters';

export interface IClone {
  id: string;
  name: string;
  templateName: CloneTemplateName;
  experience: number;
  tier: number;
  level: number;
  autoUpgradeEnabled: boolean;
  experienceMultiplier: number;
  upgradeLevel(level: number): void;
  increaseExperience(delta: number, share: boolean): void;
  getLevelRequirements(level: number): number;
  getTotalAttributeValue(attribute: Attribute): number;
  getTotalSkillValue(skill: Skill): number;
  recalculate(): void;
  removeAllEventListeners(): void;
  serialize(): IMakeCloneParameters;
}
