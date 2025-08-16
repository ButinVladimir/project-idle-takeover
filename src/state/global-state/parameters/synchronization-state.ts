import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type ICityState } from '@state/city-state/interfaces';
import { type IGlobalState, ISynchronizationState } from '../interfaces';
import { type ICompanyState } from '@state/company-state/interfaces';

const { lazyInject } = decorators;

@injectable()
export class SynchronizationState implements ISynchronizationState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _baseValue: number;
  private _totalValue: number;
  private _recalculationRequested: boolean;

  constructor() {
    this._baseValue = 0;
    this._totalValue = 0;
    this._recalculationRequested = true;

    this._stateUIConnector.registerEventEmitter(this, ['_baseValue', '_totalValue']);
  }

  get baseValue() {
    return this._baseValue;
  }

  get totalValue() {
    return this._totalValue;
  }

  requestRecalculation() {
    this._recalculationRequested = true;
  }

  recalculate() {
    if (!this._recalculationRequested) {
      return;
    }

    this._recalculationRequested = false;

    this.calculateBaseValue();
    this.calculateDistrictValues();
    this._companyState.clones.updateSynchronization();
  }

  private calculateBaseValue() {
    this._baseValue = Math.ceil(this._globalState.scenario.currentValues.startingSynchronization);
    this._totalValue = this._baseValue;
  }

  private calculateDistrictValues() {
    const availableDistricts = this._cityState.listAvailableDistricts();

    availableDistricts.forEach((districtState) => {
      districtState.parameters.synchronization.recalculate();

      this._totalValue += districtState.parameters.synchronization.value;
    });
  }
}
