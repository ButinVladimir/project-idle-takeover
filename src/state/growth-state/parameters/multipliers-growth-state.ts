import { inject, injectable } from 'inversify';
import { TYPES } from '@state/types';
import { IMultipliersGrowthState } from '../interfaces/parameters/multipliers-growth-state';
import type { IMultiplierGrowthState } from '../interfaces/parameters/multiplier-growth-state';

@injectable()
export class MultipliersGrowthState implements IMultipliersGrowthState {
  @inject(TYPES.CodeBaseGrowthState)
  private _codeBaseGrowthState!: IMultiplierGrowthState;

  @inject(TYPES.ComputationalBaseGrowthState)
  private _computationalBaseGrowthState!: IMultiplierGrowthState;

  get codeBase() {
    return this._codeBaseGrowthState;
  }

  get computationalBase() {
    return this._computationalBaseGrowthState;
  }

  resetValues() {
    this._codeBaseGrowthState.resetValues();
    this._computationalBaseGrowthState.resetValues();
  }

  clearValues() {
    this._codeBaseGrowthState.clearValues();
    this._computationalBaseGrowthState.clearValues();
  }
}
