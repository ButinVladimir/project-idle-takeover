import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import type { IGlobalState } from '@state/global-state';
import {
  IDistrictConnectivityParameter,
  IDistrictState,
  IDistrictConnectivitySerializedParameter,
} from '../interfaces';

const { lazyInject } = decorators;

export class DistrictConnectivityParameter implements IDistrictConnectivityParameter {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private _district: IDistrictState;
  private _points: number;
  private _totalValue: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._points = 0;
    this._totalValue = 1;
  }

  get points(): number {
    return this._points;
  }

  get totalValue(): number {
    return this._totalValue;
  }

  increasePoints(delta: number): void {
    this._points += delta;
  }

  recalculate(): void {
    this._totalValue =
      (1 + this._points) * (1 + this._globalState.connectivity.pointsByProgram);
  }

  async deserialize(serializedState: IDistrictConnectivitySerializedParameter): Promise<void> {
    this._points = serializedState.points;
    this._totalValue = this._points;
  }

  serialize(): IDistrictConnectivitySerializedParameter {
    return {
      points: this._points,
    };
  }
}
