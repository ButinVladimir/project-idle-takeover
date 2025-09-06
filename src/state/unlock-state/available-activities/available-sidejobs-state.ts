import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { NotificationType } from '@shared/index';
import { SidejobName } from '@state/company-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { COMMON_TEXTS, SIDEJOB_TEXTS } from '@texts/index';
import { IAvailableSidejobsState, IAvailableSidejobsSerializedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class AvailableSidejobsState implements IAvailableSidejobsState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  private _unlockedSidejobs: Set<SidejobName>;
  private _unlockedSidejobsList: SidejobName[];

  constructor() {
    this._unlockedSidejobs = new Set<SidejobName>();
    this._unlockedSidejobsList = [];

    this._stateUiConnector.registerEventEmitter(this, ['_unlockedSidejobs']);
  }

  listUnlockedSidejobs(): SidejobName[] {
    return this._unlockedSidejobsList;
  }

  isSidejobUnlocked(sidejob: SidejobName): boolean {
    return this._unlockedSidejobs.has(sidejob);
  }

  unlockSidejob(sidejob: SidejobName): void {
    if (this.isSidejobUnlocked(sidejob)) {
      return;
    }

    this._unlockedSidejobs.add(sidejob);
    this._unlockedSidejobsList.push(sidejob);

    const sidejobName = SIDEJOB_TEXTS[sidejob].title();
    this._notificationsState.pushNotification(
      NotificationType.sidejobUnlocked,
      COMMON_TEXTS.sidejobUnlocked(sidejobName),
    );
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
