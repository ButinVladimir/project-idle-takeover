import { IExponent, ILinear, RANDOM_TYPE, RewardParameterWithBase } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';
import { ScenarioRewardParameter } from '../types';

interface IDistrictValues {
  type: string | typeof RANDOM_TYPE;
  tier: {
    min: number;
    max: number;
  };
}

interface IFactionValues {
  name: string;
  startingDistrict: number;
  controlledArea: number;
  canBeJoined: boolean;
}

export interface IScenarioValues {
  map: {
    width: number;
    height: number;
    districts: IDistrictValues[];
    factions: IFactionValues[];
    neutralFactionIndex: number;
    startingDistrict: number;
  };
  startingValues: {
    money: number;
    developmentLevel: number;
    synchronization: number;
    experienceShareMultiplier: number;
  };
  mainframeHardware: {
    basePerformanceLevel: number;
    baseCoresLevel: number;
    baseRamLevel: number;
    performancePrice: IExponent;
    coresPrice: IExponent;
    ramPrice: IExponent;
  };
  mainframeSoftware: {
    performanceBoost: ILinear;
    startingPrograms: ProgramName[];
    minProcessCompletionTime: number;
  };
  developmentLevelRequirements: IExponent;
  programMultipliers: Record<
    ScenarioRewardParameter,
    {
      multiplier: number;
      exponent: number;
    }
  >;
  multiplierParameterBases: Record<RewardParameterWithBase, number>;
  storyEvents: string[];
}
