import { injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type ISettingsState } from '@state/settings-state';
import { type INotificationsState } from '@state/notifications-state';
import { type IScenarioState } from '@state/scenario-state';
import { TYPES } from '@state/types';
import { NotificationType, type IFormatter } from '@shared/index';
import { ITimeState, ITimeSerializedState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class TimeState implements ITimeState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  private _lastUpdateTime: number;
  private _accumulatedTime: number;
  private _activeTime: number;
  private _gameTime: number;
  private _gameTimeTotal: number;

  constructor() {
    this._lastUpdateTime = 0;
    this._accumulatedTime = 0;
    this._activeTime = 0;
    this._gameTime = 0;
    this._gameTimeTotal = 0;

    this._stateUiConnector.registerEventEmitter(this, []);
  }

  get lastUpdateTime() {
    return this._lastUpdateTime;
  }

  get accumulatedTime() {
    return this._accumulatedTime;
  }

  get activeTime() {
    return this._activeTime;
  }

  get gameTime() {
    return this._gameTime;
  }

  get gameTimeTotal() {
    return this._gameTimeTotal;
  }

  updateAccumulatedTime(showNotification: boolean) {
    const updateTime = Date.now();
    const earnedTime = updateTime - this.lastUpdateTime;
    this._accumulatedTime += earnedTime;
    this._lastUpdateTime = updateTime;

    if (showNotification && earnedTime > 0) {
      const formattedTime = this._formatter.formatTimeLong(earnedTime);
      this._notificationsState.pushNotification(
        NotificationType.timeAccumulated,
        msg(str`While you were away, you've earned ${formattedTime} of accumulated time.`),
      );
    }
  }

  updateActiveTime() {
    const updateTime = Date.now();
    this._activeTime += updateTime - this.lastUpdateTime;
    this._lastUpdateTime = updateTime;
  }

  checkTimeForNextTick(): boolean {
    if (this._activeTime >= this._settingsState.updateInterval) {
      return true;
    }

    if (this._accumulatedTime >= this._settingsState.updateInterval) {
      return true;
    }

    return false;
  }

  makeNextTick(): void {
    if (this._activeTime >= this._settingsState.updateInterval) {
      this._activeTime -= this._settingsState.updateInterval;
    } else if (this._accumulatedTime >= this._settingsState.updateInterval) {
      this._accumulatedTime -= this._settingsState.updateInterval;
    }

    this._gameTime += this._settingsState.updateInterval;
    this._gameTimeTotal += this._settingsState.updateInterval;
  }

  async startNewState(): Promise<void> {
    this._lastUpdateTime = Date.now();
    this._accumulatedTime = this._scenarioState.currentValues.startingAccumulatedTime;
    this._activeTime = 0;
    this._gameTime = 0;
    this._gameTimeTotal = 0;
  }

  async deserialize(serializedState: ITimeSerializedState): Promise<void> {
    this._lastUpdateTime = serializedState.lastUpdateTime;
    this._accumulatedTime = serializedState.accumulatedTime;
    this._gameTime = serializedState.gameTime;
    this._gameTimeTotal = serializedState.gameTimeTotal;

    this.updateAccumulatedTime(true);
  }

  serialize(): ITimeSerializedState {
    return {
      lastUpdateTime: this._lastUpdateTime,
      accumulatedTime: this._accumulatedTime,
      gameTime: this._gameTime,
      gameTimeTotal: this._gameTimeTotal,
    };
  }
}
