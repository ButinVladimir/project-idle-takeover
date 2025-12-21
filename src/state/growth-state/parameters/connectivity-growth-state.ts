import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IMainframeState, InformationCollectorProgram, MultiplierProgramName } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { type IActivityState } from '@state/activity-state';
import { type IGlobalState } from '@state/global-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { IConnectivityGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ConnectivityGrowthState implements IConnectivityGrowthState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;
  private _baseGrowthByProgram: number;
  private _baseGrowthByDistrict: Map<number, number>;
  private _totalGrowthByDistrict: Map<number, number>;

  constructor() {
    this._recalculated = false;
    this._baseGrowthByProgram = 0;
    this._baseGrowthByDistrict = new Map<number, number>();
    this._totalGrowthByDistrict = new Map<number, number>();
  }

  get growthByProgram() {
    this.recalculate();

    return this._baseGrowthByProgram;
  }

  resetValues(): void {
    this._recalculated = false;
  }

  clearValues(): void {
    this._baseGrowthByDistrict.clear();
    this._totalGrowthByDistrict.clear();
  }

  getBaseGrowthByDistrict(districtIndex: number): number {
    this.recalculate();

    return this._baseGrowthByDistrict.get(districtIndex) ?? 0;
  }

  getTotalGrowthByDistrict(districtIndex: number): number {
    this.recalculate();

    return this._totalGrowthByDistrict.get(districtIndex) ?? 0;
  }

  private recalculate() {
    if (this._recalculated) {
      return;
    }

    this._recalculated = true;

    this.updateGrowthByProgram();
    this.updateGrowthByDistricts();
    this.updateTotalGrowth();
  }

  private updateGrowthByProgram() {
    this._baseGrowthByProgram = 0;

    const process = this._mainframeState.processes.getProcessByName(MultiplierProgramName.informationCollector);

    if (process?.enabled) {
      const program = process.program as InformationCollectorProgram;
      this._baseGrowthByProgram = program.calculateDelta(process.threads) / process.calculateCompletionTime();
    }
  }

  private updateGrowthByDistricts() {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      this._baseGrowthByDistrict.set(districtIndex, 0);
    }

    this.updateGrowthBySidejobs();
    this.updateGrowthByPrimaryActivity();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      const districtIndex = sidejobActivity.sidejob.district.index;
      let currentGrow = this._baseGrowthByDistrict.get(districtIndex) ?? 0;
      currentGrow += sidejobActivity.getParameterGrowth(DistrictTypeRewardParameter.connectivity);
      this._baseGrowthByDistrict.set(districtIndex, currentGrow);
    }
  }

  private updateGrowthByPrimaryActivity(): void {
    for (const primaryActivity of this._activityState.primaryActivityQueue.listActivities()) {
      const districtIndex = primaryActivity.district.index;
      let currentGrow = this._baseGrowthByDistrict.get(districtIndex) ?? 0;
      currentGrow += primaryActivity.getParameterGrowth(DistrictTypeRewardParameter.connectivity);
      this._baseGrowthByDistrict.set(districtIndex, currentGrow);
    }
  }

  private updateTotalGrowth(): void {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      const district = this._cityState.getDistrictState(districtIndex);

      const nextTotalValue =
        (1 + this._globalState.connectivity.pointsByProgram + this._baseGrowthByProgram) *
        (1 + district.parameters.connectivity.points + (this._baseGrowthByDistrict.get(districtIndex) ?? 0));
      this._totalGrowthByDistrict.set(districtIndex, nextTotalValue - district.parameters.connectivity.totalValue);
    }
  }
}
