import { IMultiplierGrowthState } from './multiplier-growth-state';

export interface IMultipliersGrowthState {
  codeBase: IMultiplierGrowthState;
  computationalBase: IMultiplierGrowthState;
  resetValues(): void;
  clearValues(): void;
}
