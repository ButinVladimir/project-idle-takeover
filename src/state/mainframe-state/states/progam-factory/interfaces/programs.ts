import { Milestone, ILinear, ITierExponent, ITierLinear } from '@shared/index';
import { AutobuyerProgramName, MultiplierProgramName, OtherProgramName } from '../types';

interface ICommonProgram {
  ram: number;
  completionPoints: number;
  levelSpeedBoost: ILinear;
  coreSpeedBoost: ILinear;
  cost: ITierExponent;
  requiredMilestones: Milestone[];
}

interface IAutoscalableValue {
  main: ITierLinear;
  ram: ILinear;
  cores: ILinear;
}

export interface IPrograms {
  [OtherProgramName.shareServer]: {
    money: IAutoscalableValue;
    developmentPoints: IAutoscalableValue;
  } & ICommonProgram;
  [OtherProgramName.predictiveComputator]: {
    programCompletionSpeed: IAutoscalableValue;
  } & ICommonProgram;
  [OtherProgramName.peerReviewer]: {
    cloneExperience: IAutoscalableValue;
  } & ICommonProgram;
  [MultiplierProgramName.codeGenerator]: {
    codeBase: ITierLinear;
  } & ICommonProgram;
  [MultiplierProgramName.circuitDesigner]: {
    computationalBase: ITierLinear;
  } & ICommonProgram;
  [MultiplierProgramName.informationCollector]: {
    connectivity: ITierLinear;
  } & ICommonProgram;
  [MultiplierProgramName.dealMaker]: {
    rewards: ITierLinear;
  } & ICommonProgram;
  [AutobuyerProgramName.mainframeHardwareAutobuyer]: ICommonProgram;
  [AutobuyerProgramName.mainframeProgramsAutobuyer]: ICommonProgram;
  [AutobuyerProgramName.cloneLevelAutoupgrader]: ICommonProgram;
}
