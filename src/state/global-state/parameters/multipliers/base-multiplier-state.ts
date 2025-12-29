import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { type IGrowthState } from '@state/growth-state';
import { TYPES } from '@state/types';
import { type ICityState, IDistrictMultipliers, IDistrictMultiplierParameter } from '@state/city-state';
import { type IScenarioState } from '@state/scenario-state';
import { IMultiplierState, IMultiplierSerializedState } from '../../interfaces';

const { lazyInject } = decorators;

@injectable()
export abstract class BaseMultiplierState implements IMultiplierState {
  @lazyInject(TYPES.ScenarioState)
  protected scenarioState!: IScenarioState;

  @lazyInject(TYPES.GrowthState)
  protected growthState!: IGrowthState;

  @lazyInject(TYPES.CityState)
  protected cityState!: ICityState;

  private _pointsByProgram: number;
  private _multiplierByProgram: number;
  private _totalMultiplier: number;

  constructor() {
    this._pointsByProgram = 1;
    this._totalMultiplier = 1;
    this._multiplierByProgram = 1;
  }

  get pointsByProgram() {
    return this._pointsByProgram;
  }

  get programMultiplier() {
    return this._multiplierByProgram;
  }

  get totalMultiplier() {
    return this._totalMultiplier;
  }

  increasePointsByProgram(delta: number) {
    this._pointsByProgram += delta;
  }

  async startNewState(): Promise<void> {
    this._pointsByProgram = 0;
    this._multiplierByProgram = 1;
    this._totalMultiplier = 1;
  }

  async deserialize(serializedState: IMultiplierSerializedState): Promise<void> {
    this._pointsByProgram = serializedState.pointsByProgram;
    this._multiplierByProgram = 1;
    this._totalMultiplier = 1;
  }

  serialize(): IMultiplierSerializedState {
    return {
      pointsByProgram: this._pointsByProgram,
    };
  }

  recalculateMultipliers() {
    this.updateMultiplierByProgram();
    this.updateTotalMultiplier();
  }

  private updateMultiplierByProgram() {
    const base = this.getBase();

    this._multiplierByProgram = 1 + Math.log(1 + this._pointsByProgram) / Math.log(base);
  }

  private updateTotalMultiplier() {
    this._totalMultiplier = this._multiplierByProgram;

    const availableDistricts = this.cityState.listAvailableDistricts();

    availableDistricts.forEach((districtState) => {
      const districtMultiplierParameter = this.getDistrictMultiplierParameter(districtState.parameters.multipliers);

      districtMultiplierParameter.recalculate();

      this._totalMultiplier *= districtMultiplierParameter.multiplier;
    });
  }

  protected abstract getBase(): number;

  protected abstract getDistrictMultiplierParameter(
    districtMultipliers: IDistrictMultipliers,
  ): IDistrictMultiplierParameter;
}
