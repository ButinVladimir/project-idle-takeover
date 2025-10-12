import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { NotificationType } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { SIDEJOB_TEXTS } from '@texts/index';
import { IAvailableSidejobsState, IAvailableSidejobsSerializedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class AvailableSidejobsState implements IAvailableSidejobsState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  private _unlockedSidejobs: Set<string>;
  private _unlockedSidejobsList: string[];

  constructor() {
    this._unlockedSidejobs = new Set<string>();
    this._unlockedSidejobsList = [];

    this._stateUiConnector.registerEventEmitter(this, ['_unlockedSidejobs', '_unlockedSidejobsList']);
  }

  listUnlockedSidejobs(): string[] {
    return this._unlockedSidejobsList;
  }

  isSidejobUnlocked(sidejob: string): boolean {
    return this._unlockedSidejobs.has(sidejob);
  }

  unlockSidejob(sidejob: string): void {
    if (this.isSidejobUnlocked(sidejob)) {
      return;
    }

    this._unlockedSidejobs.add(sidejob);
    this._unlockedSidejobsList.push(sidejob);

    this._notificationsState.pushNotification(NotificationType.sidejobUnlocked, this.makeUnlockSidejobMessage(sidejob));
  }

  makeUnlockSidejobMessage(sidejob: string) {
    return msg(str`Sidejob "${SIDEJOB_TEXTS[sidejob].title()}" has been unlocked.`);
  }

  async startNewState(): Promise<void> {
    this.clearState();
  }

  async deserialize(serializedState: IAvailableSidejobsSerializedState): Promise<void> {
    this.clearState();

    serializedState.unlockedSidejobs.forEach((sidejob) => {
      this._unlockedSidejobs.add(sidejob);
      this._unlockedSidejobsList.push(sidejob);
    });
  }

  serialize(): IAvailableSidejobsSerializedState {
    return {
      unlockedSidejobs: Array.from(this._unlockedSidejobs.values()),
    };
  }

  private clearState() {
    this._unlockedSidejobs.clear();
    this._unlockedSidejobsList.length = 0;
  }
}
