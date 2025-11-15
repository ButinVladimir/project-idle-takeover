import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IMainframeState, InformationCollectorProgram, MultiplierProgramName } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { type IActivityState } from '@state/activity-state';
import { calculatePower } from '@shared/index';
import { IConnectivityGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ConnectivityGrowthState implements IConnectivityGrowthState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;
  protected _baseGrowthByProgram: number;
  protected _baseGrowthByDistrict: Map<number, number>;
  protected _totalGrowthByDistrict: Map<number, number>;

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

    if (process?.isActive) {
      const program = process.program as InformationCollectorProgram;
      this._baseGrowthByProgram = program.calculateDelta(process.threads) / process.calculateCompletionTime();
    }
  }

  private updateGrowthByDistricts() {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      this._baseGrowthByDistrict.set(districtIndex, 0);
    }

    this.updateGrowthBySidejobs();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejob of this._activityState.sidejobs.listSidejobs()) {
      if (!sidejob.isActive) {
        continue;
      }

      let currentGrow = this._baseGrowthByDistrict.get(sidejob.district.index)!;
      currentGrow += sidejob.calculateConnectivityDelta(1);
      this._baseGrowthByDistrict.set(sidejob.district.index, currentGrow);
    }
  }

  private updateTotalGrowth(): void {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      const district = this._cityState.getDistrictState(districtIndex);
      const totalGrowthByProgram =
        this._baseGrowthByProgram *
        calculatePower(
          district.parameters.influence.tier,
          district.template.parameters.connectivity.programPointsMultiplier,
        );
      const baseGrowthByDistrict = this._baseGrowthByDistrict.get(districtIndex) ?? 0;

      this._totalGrowthByDistrict.set(districtIndex, totalGrowthByProgram + baseGrowthByDistrict);
    }
  }
}
