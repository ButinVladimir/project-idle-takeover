import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import type {
  IDevelopmentGrowthState,
  IMoneyGrowthState,
  IMultipliersGrowthState,
  IConnectivityGrowthState,
  IDistrictTierPointsGrowthState,
  IExperienceGrowthState,
} from './interfaces';
import { IGrowthState } from './interfaces/growth-state';

@injectable()
export class GrowthState implements IGrowthState {
  @inject(TYPES.MoneyGrowthState)
  private _moneyGrowthState!: IMoneyGrowthState;

  @inject(TYPES.DevelopmentGrowthState)
  private _developmentGrowthState!: IDevelopmentGrowthState;

  @inject(TYPES.MultipliersGrowthState)
  private _multipliersGrowthState!: IMultipliersGrowthState;

  @inject(TYPES.ConnectivityGrowthState)
  private _connectivityGrowthState!: IConnectivityGrowthState;

  @inject(TYPES.DistrictTierPointsGrowthState)
  private _districtTierPointsGrowthState!: IDistrictTierPointsGrowthState;

  @inject(TYPES.ExperienceGrowthState)
  private _experienceGrowthState!: IExperienceGrowthState;

  get money(): IMoneyGrowthState {
    return this._moneyGrowthState;
  }

  get development(): IDevelopmentGrowthState {
    return this._developmentGrowthState;
  }

  get multipliers(): IMultipliersGrowthState {
    return this._multipliersGrowthState;
  }

  get connectivity(): IConnectivityGrowthState {
    return this._connectivityGrowthState;
  }

  get districtTierPoints(): IDistrictTierPointsGrowthState {
    return this._districtTierPointsGrowthState;
  }

  get experience(): IExperienceGrowthState {
    return this._experienceGrowthState;
  }

  clearValues() {
    this._multipliersGrowthState.clearValues();
    this._connectivityGrowthState.clearValues();
    this._districtTierPointsGrowthState.clearValues();
    this._experienceGrowthState.clearValues();
  }

  resetValues() {
    this._moneyGrowthState.resetValues();
    this._developmentGrowthState.resetValues();
    this._multipliersGrowthState.resetValues();
    this._connectivityGrowthState.resetValues();
    this._districtTierPointsGrowthState.resetValues();
    this._experienceGrowthState.resetValues();
  }
}
