import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { IRewardsSerializedState, IRewardsState, type IGlobalState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class RewardsState implements IRewardsState {
  @lazyInject(TYPES.GlobalState)
  protected globalState!: IGlobalState;

  private _pointsByProgram: number;
  private _multiplierByProgram: number;

  constructor() {
    this._pointsByProgram = 0;
    this._multiplierByProgram = 1;
  }

  get pointsByProgram() {
    return this._pointsByProgram;
  }

  get multiplierByProgram() {
    return this._multiplierByProgram;
  }

  increasePointsByProgram(delta: number) {
    this._pointsByProgram += delta;
  }

  recalculateMultiplier() {
    const parameters = this.globalState.scenario.currentValues.programMultipliers.rewards;

    this._multiplierByProgram =
      1 + Math.log(1 + this._pointsByProgram / parameters.pointsToSoftCap) / Math.log(parameters.logBase);
  }

  async startNewState(): Promise<void> {
    this._pointsByProgram = 0;
  }

  async deserialize(serializedState: IRewardsState): Promise<void> {
    this._pointsByProgram = serializedState.pointsByProgram;
  }

  serialize(): IRewardsSerializedState {
    return {
      pointsByProgram: this._pointsByProgram,
    };
  }
}
