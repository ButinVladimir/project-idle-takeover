import { BaseController } from '@shared/base-controller';
import { IDistrictMultipliers, IDistrictState } from '@state/city-state';
import { MultipliersType } from '../../types';

export class StatisticsMultipliersController extends BaseController {
  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getDistrictMultiplier(districtIndex: number, multiplierType: MultipliersType): number {
    const districtMultipliers = this.cityState.getDistrictState(districtIndex).parameters.multipliers;

    return this.getDistrictMultiplierParameter(districtMultipliers, multiplierType).multiplier;
  }

  getProgramMultiplier(multiplierType: MultipliersType) {
    return this.getGlobalMultiplierState(multiplierType).programMultiplier;
  }

  getDistrictMultipliers(districtMultipliers: IDistrictMultipliers, multiplierType: MultipliersType) {
    return this.getDistrictMultiplierParameter(districtMultipliers, multiplierType).multiplier;
  }

  getTotalMultiplier(multiplierType: MultipliersType) {
    const result = this.getGlobalMultiplierState(multiplierType).totalMultiplier;

    return result;
  }

  private getGlobalMultiplierState(multiplierType: MultipliersType) {
    switch (multiplierType) {
      case 'mainframeHardwareCostDivisors':
        return this.globalState.multipliers.computationalBase;
      case 'mainframeProgramsCostDivisors':
        return this.globalState.multipliers.codeBase;
    }
  }

  private getDistrictMultiplierParameter(districtMultipliers: IDistrictMultipliers, multiplierType: MultipliersType) {
    switch (multiplierType) {
      case 'mainframeHardwareCostDivisors':
        return districtMultipliers.computationalBase;
      case 'mainframeProgramsCostDivisors':
        return districtMultipliers.codeBase;
    }
  }
}
