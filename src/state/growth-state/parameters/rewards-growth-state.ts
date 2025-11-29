import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { DealMakerProgram, type IMainframeState, MultiplierProgramName } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { type IActivityState } from '@state/activity-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { IRewardsGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class RewardsGrowthState implements IRewardsGrowthState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;

  private _growthByProgram: number;
  private _growthByDistrict: Map<number, number>;

  constructor() {
    this._recalculated = false;
    this._growthByProgram = 0;
    this._growthByDistrict = new Map<number, number>();
  }

  get growthByProgram() {
    this.recalculate();

    return this._growthByProgram;
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

    this.updateGrowthByProgram();
    this.updateGrowthByDistricts();
  }

  private updateGrowthByProgram() {
    this._growthByProgram = 0;

    const process = this._mainframeState.processes.getProcessByName(MultiplierProgramName.dealMaker);

    if (process?.isActive) {
      const program = process.program as DealMakerProgram;
      this._growthByProgram = program.calculateDelta(process.threads) / process.calculateCompletionTime();
    }
  }

  private updateGrowthByDistricts() {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      this._growthByDistrict.set(districtIndex, 0);
    }

    this.updateGrowthBySidejobs();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      if (!sidejobActivity.active) {
        continue;
      }

      const districtIndex = sidejobActivity.sidejob.district.index;
      let currentGrow = this._growthByDistrict.get(districtIndex) ?? 0;
      currentGrow += sidejobActivity.sidejob.calculateParameterDelta(DistrictTypeRewardParameter.rewards, 1);
      this._growthByDistrict.set(districtIndex, currentGrow);
    }
  }
}
