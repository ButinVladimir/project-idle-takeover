import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type ICityState } from '@state/city-state';
import { type IScenarioState } from '@state/scenario-state';
import { type IClonesState } from '@state/clones-state';
import { type IGlobalState, ISynchronizationState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class SynchronizationState implements ISynchronizationState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _baseValue: number;
  private _availableValue: number;
  private _totalValue: number;
  private _recalculationRequested: boolean;

  constructor() {
    this._baseValue = 0;
    this._availableValue = 0;
    this._totalValue = 0;
    this._recalculationRequested = true;

    this._stateUIConnector.registerEventEmitter(this, ['_baseValue', '_availableValue', '_totalValue']);
  }

  get baseValue() {
    return this._baseValue;
  }

  get availableValue() {
    return this._availableValue;
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
    this.calculateAvailableValue();
  }

  private calculateBaseValue() {
    this._baseValue = Math.ceil(this._scenarioState.currentValues.startingValues.synchronization);
    this._totalValue = this._baseValue;
  }

  private calculateDistrictValues() {
    const availableDistricts = this._cityState.listAvailableDistricts();

    availableDistricts.forEach((districtState) => {
      districtState.parameters.synchronization.recalculate();

      this._totalValue += districtState.parameters.synchronization.value;
    });
  }

  private calculateAvailableValue() {
    this._availableValue = this._totalValue;

    for (const clone of this._clonesState.ownedClones.listClones()) {
      this._availableValue -= this._clonesState.ownedClones.calculateCloneSynchronization(
        clone.templateName,
        clone.tier,
      );
    }
  }
}
