import { BaseController } from '@shared/index';
import { IDistrictState } from '@state/city-state';

export class StatisticsSynchronizationController extends BaseController {
  get baseValue(): number {
    return this.globalState.synchronization.baseValue;
  }

  get totalValue(): number {
    return this.globalState.synchronization.totalValue;
  }

  listAvailableDistricts(): IDistrictState[] {
    return this.cityState.listAvailableDistricts();
  }

  getDistrictSynchronization(districtIndex: number): number {
    return this.cityState.getDistrictState(districtIndex).parameters.synchronization.value;
  }
}
