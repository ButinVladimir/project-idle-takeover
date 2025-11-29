import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type ICityState } from '@state/city-state';
import { type IActivityState } from '@state/activity-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { IInfluenceGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class InfluenceGrowthState implements IInfluenceGrowthState {
  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;
  private _growthByDistrict: Map<number, number>;

  constructor() {
    this._recalculated = false;
    this._growthByDistrict = new Map<number, number>();
  }

  resetValues(): void {
    this._recalculated = false;
  }

  clearValues(): void {
    this._growthByDistrict.clear();
  }

  getGrowthByDistrict(districtIndex: number): number {
    this.recalculate();

    return this._growthByDistrict.get(districtIndex) ?? 0;
  }

  private recalculate() {
    if (this._recalculated) {
      return;
    }

    this._recalculated = true;

    for (let index = 0; index < this._cityState.districtsCount; index++) {
      this._growthByDistrict.set(index, 0);
    }

    this.updateGrowthBySidejobs();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      if (!sidejobActivity.active) {
        continue;
      }

      const districtIndex = sidejobActivity.sidejob.district.index;
      let currentGrowth = this._growthByDistrict.get(districtIndex) ?? 0;
      currentGrowth += sidejobActivity.sidejob.calculateParameterDelta(DistrictTypeRewardParameter.influence, 1);
      this._growthByDistrict.set(districtIndex, currentGrowth);
    }
  }
}
