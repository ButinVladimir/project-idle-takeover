import { injectable } from 'inversify';
import merge from 'lodash/merge';
import { decorators } from '@state/container';
import factions from '@configs/factions.json';
import { Faction } from '@shared/types';
import { type IScenarioState } from '@state/scenario-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { TYPES } from '@state/types';
import { IFactionValues, IFactionState, IFactionSerializedState } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class FactionState implements IFactionState {
  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _currentFaction!: Faction;
  private _currentFactionValues!: IFactionValues;

  constructor() {
    this.currentFaction = this._scenarioState.currentValues.startingFaction;

    this._stateUiConnector.registerEventEmitter(this, ['_currentFaction']);
  }

  get currentFaction(): Faction {
    return this._currentFaction;
  }

  set currentFaction(value: Faction) {
    this._currentFaction = value;
    this._currentFactionValues = this.getFactionValues(value);
  }

  get currentFactionValues() {
    return this._currentFactionValues;
  }

  getFactionValues(faction: Faction): IFactionValues {
    return merge({}, factions[faction]) as IFactionValues;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFactionLoanTier(faction: Faction) {
    return 7;
  }

  async startNewState(): Promise<void> {
    this.currentFaction = this._scenarioState.currentValues.startingFaction;
  }

  async deserialize(serializedState: IFactionSerializedState): Promise<void> {
    this.currentFaction = serializedState.currentFaction;
  }

  serialize(): IFactionSerializedState {
    return {
      currentFaction: this._currentFaction,
    };
  }
}
