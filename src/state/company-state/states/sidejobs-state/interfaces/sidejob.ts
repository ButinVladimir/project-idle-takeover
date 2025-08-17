import { Attribute, Skill } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '../../clone-factory';
import { SidejobName } from '../types';
import { IMakeSidejobParameters } from './make-sidejob-parameters';
import { ISidejobTemplate } from './sidejob-template';

export interface ISidejob {
  id: string;
  sidejobName: SidejobName;
  district: IDistrictState;
  isActive: boolean;
  assignedClone?: IClone;
  sidejobTemplate: ISidejobTemplate;
  checkRequirements(): boolean;
  getAttributeRequirement(attribute: Attribute): number;
  getSkillRequirement(skill: Skill): number;
  getAttributeModifier(attribute: Attribute): number;
  getSkillModifier(skill: Skill): number;
  perform(): void;
  calculateExperienceDelta(passedTime: number): number;
  calculateMoneyDelta(passedTime: number): number;
  calculateDevelopmentPointsDelta(passedTime: number): number;
  calculateDistrictTierPointsDelta(passedTime: number): number;
  calculateConnectivityDelta(passedTime: number): number;
  calculateCodeBaseDelta(passedTime: number): number;
  calculateComputationalBaseDelta(passedTime: number): number;
  calculateRewardsDelta(passedTime: number): number;
  calculateProcessCompletionSpeedDelta(): number;
  handlePerformanceUpdate(): void;
  serialize(): IMakeSidejobParameters;
  removeAllEventListeners(): void;
}
