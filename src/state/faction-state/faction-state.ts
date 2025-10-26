import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import factions from '@configs/factions.json';
import { Faction, NotificationType } from '@shared/types';
import { type IScenarioState } from '@state/scenario-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { type IUnlockState } from '@state/unlock-state';
import { type ICityState } from '../city-state';
import { TYPES } from '@state/types';
import { FACTION_TEXTS, SPECIAL_EVENTS_MESSAGES } from '@texts/index';
import { IFactionValues, IFactionState, IFactionSerializedState } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class FactionState implements IFactionState {
  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  private _joiningFactionAvailable: boolean;
  private _allFactionsList: Faction[];
  private _availableFactionsList: Faction[];
  private _currentFaction!: Faction;
  private _currentFactionValues!: IFactionValues;

  constructor() {
    this._joiningFactionAvailable = false;
    this.currentFaction = 'neutral';
    this._allFactionsList = [];
    this._availableFactionsList = [];

    this._stateUiConnector.registerEventEmitter(this, [
      '_joiningFactionAvailable',
      '_currentFaction',
      '_allFactionsList',
      '_availableFactionsList',
    ]);
  }

  get currentFaction(): Faction {
    return this._currentFaction;
  }

  private set currentFaction(value: Faction) {
    this._currentFaction = value;
    this._currentFactionValues = this.getFactionValues(value);
  }

  get currentFactionValues() {
    return this._currentFactionValues;
  }

  get joiningFactionAvailable() {
    return this._joiningFactionAvailable;
  }

  getFactionValues(faction: Faction): IFactionValues {
    return (factions as any as Record<Faction, IFactionValues>)[faction];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFactionLoanTier(faction: Faction) {
    return 7;
  }

  listAvailableFactions(): Faction[] {
    return this._availableFactionsList;
  }

  getFactionByIndex(index: number): Faction {
    if (index < 0 || index >= this._allFactionsList.length) {
      throw new Error('Invalid faction index');
    }

    return this._allFactionsList[index];
  }

  makeJoiningFactionAvailable() {
    if (this._joiningFactionAvailable) {
      return;
    }

    this._joiningFactionAvailable = true;
    this._notificationsState.pushNotification(
      NotificationType.factionsAvailable,
      SPECIAL_EVENTS_MESSAGES.factionsAvailable(),
    );
  }

  joinFaction(faction: Faction): boolean {
    if (this._currentFaction !== 'neutral') {
      return false;
    }

    if (!this._availableFactionsList.includes(faction)) {
      return false;
    }

    this.currentFaction = faction;
    this._unlockState.requestRecalculation();
    this._cityState.updateDistrictsStateAfterJoiningFaction(faction);

    this._notificationsState.pushNotification(
      NotificationType.factionJoined,
      msg(
        str`You have joined faction ${FACTION_TEXTS[faction].title()}. Loaned items, available districts and activities have been updated.`,
      ),
    );

    this._scenarioState.storyEvents.visitEvents();

    return true;
  }

  async startNewState(): Promise<void> {
    this._joiningFactionAvailable = false;

    this.makeAllFactionsList();

    this.currentFaction = 'neutral';

    this.updateAvailableFactions();
  }

  async deserialize(serializedState: IFactionSerializedState): Promise<void> {
    this._joiningFactionAvailable = serializedState.joiningFactionAvailable;

    this._allFactionsList.length = 0;
    serializedState.factionsList.forEach((faction) => {
      this._allFactionsList.push(faction);
    });

    this.currentFaction = serializedState.currentFaction;

    this.updateAvailableFactions();
  }

  serialize(): IFactionSerializedState {
    return {
      joiningFactionAvailable: this._joiningFactionAvailable,
      currentFaction: this._currentFaction,
      factionsList: this._allFactionsList,
    };
  }

  private makeAllFactionsList() {
    this._allFactionsList.length = 0;

    this._scenarioState.currentValues.map.factions.forEach((values) => {
      this._allFactionsList.push(values.name);
    });
  }

  private updateAvailableFactions() {
    this._availableFactionsList.length = 0;

    if (this._currentFaction !== 'neutral') {
      return;
    }

    this._allFactionsList.forEach((faction, index) => {
      if (this._scenarioState.currentValues.map.factions[index].canBeJoined) {
        this._availableFactionsList.push(faction);
      }
    });
  }
}
