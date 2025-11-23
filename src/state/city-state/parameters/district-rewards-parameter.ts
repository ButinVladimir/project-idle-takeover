import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import type { IGlobalState } from '@state/global-state';
import { IDistrictRewardsParameter, IDistrictState, IDistrictRewardsSerializedParameter } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictRewardsParameter implements IDistrictRewardsParameter {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private _district: IDistrictState;
  private _points: number;
  private _totalMultiplier: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._points = 0;
    this._totalMultiplier = 1;
  }

  get points(): number {
    return this._points;
  }

  get totalMultiplier(): number {
    return this._totalMultiplier;
  }

  increasePoints(delta: number): void {
    this._points += delta;
  }

  recalculate(): void {
    const base = this._district.template.multiplierParameterBases.rewards;

    const districtMultiplier =
      1 + Math.log(1 + this._points) / Math.log(base);

    this._totalMultiplier = districtMultiplier * this._globalState.rewards.multiplierByProgram;
  }

  async deserialize(serializedState: IDistrictRewardsSerializedParameter): Promise<void> {
    this._points = serializedState.points;
  }

  serialize(): IDistrictRewardsSerializedParameter {
    return {
      points: this._points,
    };
  }
}
