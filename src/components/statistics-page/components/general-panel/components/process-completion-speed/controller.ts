import { BaseController, Feature } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsProcessCompletionSpeedController extends BaseController {
  get multiplierByHardware() {
    return this.globalState.processCompletionSpeed.multiplierByHardware;
  }

  get multiplierByProgram() {
    return this.globalState.processCompletionSpeed.multiplierByProgram;
  }

  get totalMultiplier() {
    return this.globalState.processCompletionSpeed.totalMultiplier;
  }

  areDistrictsAvailable() {
    return this.globalState.unlockedFeatures.isFeatureUnlocked(Feature.companyManagement);
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }
}
