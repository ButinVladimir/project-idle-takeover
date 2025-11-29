import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IMainframeState, OtherProgramName, ShareServerProgram } from '@state/mainframe-state';
import { type IActivityState } from '@state/activity-state';
import { DistrictTypeRewardParameter, INCOME_SOURCES, IncomeSource } from '@shared/index';
import { IMoneyGrowthState } from '../interfaces/parameters/money-growth-state';

const { lazyInject } = decorators;

@injectable()
export class MoneyGrowthState implements IMoneyGrowthState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _recalculated: boolean;
  private _totalGrowth: number;
  private _growth: Map<IncomeSource, number>;

  constructor() {
    this._recalculated = false;
    this._totalGrowth = 0;
    this._growth = new Map<IncomeSource, number>();
  }

  get totalGrowth() {
    this.recalculate();

    return this._totalGrowth;
  }

  getGrowth(incomeSource: IncomeSource): number {
    this.recalculate();

    return this._growth.get(incomeSource) ?? 0;
  }

  resetValues() {
    this._recalculated = false;
  }

  private recalculate() {
    if (this._recalculated) {
      return;
    }

    this._recalculated = true;

    this.updateGrowthByProgram();
    this.updateGrowthBySidejobs();
    this.updateTotalGrowth();
  }

  private updateGrowthByProgram() {
    const shareServerProcess = this._mainframeState.processes.getProcessByName(OtherProgramName.shareServer);
    let incomeByProgram = 0;

    if (shareServerProcess?.isActive) {
      incomeByProgram = (shareServerProcess.program as ShareServerProgram).calculateMoneyDelta(
        shareServerProcess.usedCores,
        shareServerProcess.totalRam,
        1,
      );
    }

    this._growth.set(IncomeSource.program, incomeByProgram);
  }

  private updateGrowthBySidejobs() {
    let incomeBySidejobs = 0;

    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      if (!sidejobActivity.active) {
        continue;
      }

      incomeBySidejobs += sidejobActivity.sidejob.calculateParameterDelta(DistrictTypeRewardParameter.money, 1);
    }

    this._growth.set(IncomeSource.sidejob, incomeBySidejobs);
  }

  private updateTotalGrowth() {
    this._totalGrowth = INCOME_SOURCES.reduce((sum, incomeSource) => sum + this.getGrowth(incomeSource), 0);
  }
}
