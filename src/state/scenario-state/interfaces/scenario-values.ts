import { DistrictType, Faction, IExponent, ILinear, RANDOM_TYPE } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';
import { IStoryEvent } from './story-events';
import { IMultiplierScenarioParameters } from './multiplier-scenario-parameters';

interface IDistrictValues {
  type: DistrictType | typeof RANDOM_TYPE;
  tier: {
    min: number;
    max: number;
  };
}

interface IFactionValues {
  name: Faction;
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
    startingFactionIndex: number;
  };
  startingMoney: number;
  startingDevelopmentLevel: number;
  startingAccumulatedTime: number;
  startingSynchronization: number;
  baseSharedExperienceMultiplier: number;
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
  programMultipliers: {
    money: {
      pointsMultiplier: number;
    };
    developmentPoints: {
      pointsMultiplier: number;
    };
    codeBase: IMultiplierScenarioParameters;
    computationalBase: IMultiplierScenarioParameters;
    connectivity: {
      pointsMultiplier: number;
    };
    rewards: IMultiplierScenarioParameters;
  };
  storyEvents: IStoryEvent[];
}
