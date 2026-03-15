import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { NotificationType } from '@shared/index';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { SIDEJOB_TEXTS } from '@texts/index';
import { IAvailableCategoryActivitiesSerializedState, IAvailableCategoryActivitiesState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class AvailableSidejobsState implements IAvailableCategoryActivitiesState {
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

  listUnlockedActivities(): string[] {
    return this._unlockedSidejobsList;
  }

  listAvailableActivities(): string[] {
    return this._unlockedSidejobsList;
  }

  isActivityUnlocked(sidejob: string): boolean {
    return this._unlockedSidejobs.has(sidejob);
  }

  isActivityAvailable(sidejob: string): boolean {
    return this.isActivityUnlocked(sidejob);
  }

  unlockActivity(sidejob: string): void {
    if (this.isActivityUnlocked(sidejob)) {
      return;
    }

    this._unlockedSidejobs.add(sidejob);
    this._unlockedSidejobsList.push(sidejob);

    this._notificationsState.pushNotification(
      NotificationType.activityUnlocked,
      this.makeUnlockActivityMessage(sidejob),
    );
  }

  makeUnlockActivityMessage(sidejob: string) {
    return msg(str`Sidejob "${SIDEJOB_TEXTS[sidejob].title()}" has been unlocked.`);
  }

  recalculate() {
    this._unlockedSidejobsList.length = 0;
    this._unlockedSidejobs.forEach((sidejob) => {
      this._unlockedSidejobsList.push(sidejob);
    });
  }

  async startNewState(): Promise<void> {
    this._unlockedSidejobs.clear();
    this.recalculate();
  }

  async deserialize(serializedState: IAvailableCategoryActivitiesSerializedState): Promise<void> {
    this._unlockedSidejobs.clear();

    serializedState.unlockedActivities.forEach((sidejob) => {
      this._unlockedSidejobs.add(sidejob);
    });

    this.recalculate();
  }

  serialize(): IAvailableCategoryActivitiesSerializedState {
    return {
      unlockedActivities: Array.from(this._unlockedSidejobs.values()),
    };
  }
}
