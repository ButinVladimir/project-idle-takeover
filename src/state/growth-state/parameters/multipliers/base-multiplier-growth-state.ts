import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { ProgramName, IProcess, type IMainframeState } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { ISidejob, type IActivityState } from '@state/activity-state';
import { IMultiplierGrowthState } from '../../interfaces/parameters/multiplier-growth-state';

const { lazyInject } = decorators;

@injectable()
export abstract class BaseMultiplierGrowthState implements IMultiplierGrowthState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;
  protected _growthByProgram: number;
  protected _growthByDistrict: Map<number, number>;

  constructor() {
    this._recalculated = false;
    this._growthByProgram = 0;
    this._growthByDistrict = new Map<number, number>();
  }

  get growthByProgram() {
    this.recalculate();

    return this._growthByProgram;
  }

  resetValues() {
    this._recalculated = false;
  }

  clearValues() {
    this._growthByDistrict.clear();
  }

  getGrowthByDistrict(districtIndex: number): number {
    this.recalculate();

    return this._growthByDistrict.get(districtIndex) ?? 0;
  }

  private recalculate(): void {
    if (this._recalculated) {
      return;
    }

    this._recalculated = true;

    this.updateGrowthByProgram();
    this.updateGrowthByDistricts();
  }

  private updateGrowthByProgram(): void {
    const mainframeProcessesState = this._mainframeState.processes;

    const process = mainframeProcessesState.getProcessByName(this.getProgramName());
    this._growthByProgram = 0;

    if (process?.isActive) {
      this._growthByProgram = this.getGrowthByProgram(process);
    }
  }

  private updateGrowthByDistricts(): void {
    for (let districtIndex = 0; districtIndex < this._cityState.districtsCount; districtIndex++) {
      this._growthByDistrict.set(districtIndex, 0);
    }

    this.updateGrowthBySidejobs();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejob of this._activityState.sidejobs.listSidejobs()) {
      if (!sidejob.isActive) {
        continue;
      }

      let currentGrow = this._growthByDistrict.get(sidejob.district.index) ?? 0;
      currentGrow += this.getGrowthBySidejob(sidejob);
      this._growthByDistrict.set(sidejob.district.index, currentGrow);
    }
  }

  protected abstract getProgramName(): ProgramName;

  protected abstract getGrowthByProgram(process: IProcess): number;

  protected abstract getGrowthBySidejob(sidejob: ISidejob): number;
}
