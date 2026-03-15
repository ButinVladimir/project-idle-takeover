import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { NotificationType } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { type IFactionState } from '@state/faction-state';
import { CONTRACT_TEXTS } from '@texts/index';
import { IAvailableCategoryActivitiesSerializedState, IAvailableCategoryActivitiesState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class AvailableContractsState implements IAvailableCategoryActivitiesState {
  @lazyInject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  private _unlockedContracts: Set<string>;
  private _unlockedContractsList: string[];
  private _availableContractsList: string[];

  constructor() {
    this._unlockedContracts = new Set<string>();
    this._unlockedContractsList = [];
    this._availableContractsList = [];

    this._stateUiConnector.registerEventEmitter(this, [
      '_unlockedContracts',
      '_unlockedContractsList',
      '_availableContractsList',
    ]);
  }

  listUnlockedActivities(): string[] {
    return this._unlockedContractsList;
  }

  listAvailableActivities(): string[] {
    return this._availableContractsList;
  }

  isActivityUnlocked(contract: string): boolean {
    return this._unlockedContracts.has(contract);
  }

  isActivityAvailable(contract: string): boolean {
    return (
      this.isActivityUnlocked(contract) &&
      this._factionState.currentFactionValues.activities.contracts.includes(contract)
    );
  }

  unlockActivity(contract: string): void {
    if (this.isActivityUnlocked(contract)) {
      return;
    }

    this._unlockedContracts.add(contract);
    this._unlockedContractsList.push(contract);

    if (this.isActivityAvailable(contract)) {
      this._availableContractsList.push(contract);
    }

    this._notificationsState.pushNotification(
      NotificationType.activityUnlocked,
      this.makeUnlockActivityMessage(contract),
    );
  }

  makeUnlockActivityMessage(contract: string) {
    return msg(str`Contract "${CONTRACT_TEXTS[contract].title()}" has been unlocked.`);
  }

  recalculate() {
    this._unlockedContractsList.length = 0;
    this._availableContractsList.length = 0;

    this._unlockedContracts.forEach((contract) => {
      this._unlockedContractsList.push(contract);

      if (this.isActivityAvailable(contract)) {
        this._availableContractsList.push(contract);
      }
    });
  }

  async startNewState(): Promise<void> {
    this._unlockedContracts.clear();
    this.recalculate();
  }

  async deserialize(serializedState: IAvailableCategoryActivitiesSerializedState): Promise<void> {
    this._unlockedContracts.clear();

    serializedState.unlockedActivities.forEach((contract) => {
      this._unlockedContracts.add(contract);
    });

    this.recalculate();
  }

  serialize(): IAvailableCategoryActivitiesSerializedState {
    return {
      unlockedActivities: Array.from(this._unlockedContracts.values()),
    };
  }
}
