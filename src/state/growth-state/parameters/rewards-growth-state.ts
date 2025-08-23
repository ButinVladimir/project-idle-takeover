import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { DealMakerProgram, type IMainframeState, MultiplierProgramName } from '@state/mainframe-state';
import { type ICityState } from '@state/city-state';
import { type ICompanyState } from '@state/company-state';
import { IRewardsGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class RewardsGrowthState implements IRewardsGrowthState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

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
    for (const sidejob of this._companyState.sidejobs.listSidejobs()) {
      if (!sidejob.isActive) {
        continue;
      }

      let currentGrow = this._growthByDistrict.get(sidejob.district.index)!;
      currentGrow += sidejob.calculateRewardsDelta(1);
      this._growthByDistrict.set(sidejob.district.index, currentGrow);
    }
  }
}
