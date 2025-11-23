import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import {
  IMultipliersSerializedState,
  type IMultiplierState,
  type IMultipliersState,
} from '../interfaces';

@injectable()
export class MultipliersState implements IMultipliersState {
  @inject(TYPES.CodeBaseState)
  private _codeBaseState!: IMultiplierState;

  @inject(TYPES.ComputationalBaseState)
  private _computationalBaseState!: IMultiplierState;

  get codeBase() {
    return this._codeBaseState;
  }

  get computationalBase() {
    return this._computationalBaseState;
  }

  recalculate() {
    this._codeBaseState.recalculateMultipliers();
    this._computationalBaseState.recalculateMultipliers();
  }

  async startNewState(): Promise<void> {
    await this._codeBaseState.startNewState();
    await this._computationalBaseState.startNewState();
  }

  async deserialize(serializedState: IMultipliersSerializedState): Promise<void> {
    await this._codeBaseState.deserialize(serializedState.codeBase);
    await this._computationalBaseState.deserialize(serializedState.computationalBase);
  }

  serialize(): IMultipliersSerializedState {
    return {
      codeBase: this._codeBaseState.serialize(),
      computationalBase: this._computationalBaseState.serialize(),
    };
  }
}
