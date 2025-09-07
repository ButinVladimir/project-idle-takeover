import { injectable } from 'inversify';
import { IDistrictMultipliers, IDistrictMultiplierParameter } from '@state/city-state';
import { BaseMultiplierState } from './base-multiplier-state';

@injectable()
export class CodeBaseState extends BaseMultiplierState {
  getMultiplierParameters() {
    return this.scenarioState.currentValues.programMultipliers.codeBase;
  }

  getDistrictMultiplierParameter(districtMultipliers: IDistrictMultipliers): IDistrictMultiplierParameter {
    return districtMultipliers.codeBase;
  }
}
