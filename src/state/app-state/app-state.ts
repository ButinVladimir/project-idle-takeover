import { inject, injectable } from 'inversify';
import { msg } from '@lit/localize';
import { type INotificationsState } from '@state/notifications-state';
import { type ISettingsState } from '@state/settings-state';
import { type ICityState } from '@state/city-state';
import { type IMainframeState } from '@state/mainframe-state';
import { type IGlobalState } from '@state/global-state';
import { type IAutomationState } from '@state/automation-state';
import { type IGrowthState } from '@state/growth-state';
import { type IClonesState } from '@state/clones-state';
import { type IActivityState } from '@state/activity-state';
import { type IFactionState } from '@state/faction-state';
import { type IScenarioState } from '@state/scenario-state';
import { type IUnlockState } from '@state/unlock-state';
import { GameSpeed } from '@state/global-state/types';
import { TYPES } from '@state/types';
import { NotificationType } from '@shared/types';
import { CURRENT_VERSION } from '@shared/constants';
import { IAppState, ISerializedState } from './interfaces';
import { Migrator } from './migrator';

@injectable()
export class AppState implements IAppState {
  @inject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @inject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @inject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @inject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @inject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @inject(TYPES.GrowthState)
  private _growthState!: IGrowthState;

  @inject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @inject(TYPES.CityState)
  private _cityState!: ICityState;

  @inject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @inject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @inject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @inject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  updateState() {
    if (this._globalState.gameSpeed === GameSpeed.paused) {
      this._globalState.time.updateAccumulatedTime(false);
    } else {
      this._globalState.time.updateActiveTime();
    }

    let maxUpdates = Math.floor(this._globalState.time.activeTime / this._settingsState.updateInterval);

    switch (this._globalState.gameSpeed) {
      case GameSpeed.paused:
        maxUpdates = 0;
        break;
      case GameSpeed.normal:
        break;
      case GameSpeed.fast:
        maxUpdates *= this._settingsState.fastSpeedMultiplier;
        break;
    }

    maxUpdates = Math.min(maxUpdates, this._settingsState.maxUpdatesPerTick);

    this.processTicks(maxUpdates);
  }

  fastForwardState(): boolean {
    this._globalState.time.updateActiveTime();

    const maxUpdates = this._settingsState.maxUpdatesPerTick;

    const ticksProcessed = this.processTicks(maxUpdates);

    return ticksProcessed === maxUpdates;
  }

  async startNewState(): Promise<void> {
    await this._settingsState.startNewState();
    await this._globalState.startNewState();
    await this._scenarioState.startNewState();
    await this._factionState.startNewState();
    await this._unlockState.startNewState();
    await this._clonesState.startNewState();
    await this._cityState.startNewState();
    await this._mainframeState.startNewState();
    await this._automationState.startNewState();
    await this._activityState.startNewState();

    this._globalState.recalculate();
    this._growthState.clearValues();
    this._unlockState.recalculate();

    this._scenarioState.storyEvents.visitEvents();
  }

  serialize(): ISerializedState {
    const saveState: ISerializedState = {
      gameVersion: CURRENT_VERSION,
      scenario: this._scenarioState.serialize(),
      faction: this._factionState.serialize(),
      unlock: this._unlockState.serialize(),
      global: this._globalState.serialize(),
      settings: this._settingsState.serialize(),
      clones: this._clonesState.serialize(),
      city: this._cityState.serialize(),
      mainframe: this._mainframeState.serialize(),
      automation: this._automationState.serialize(),
      activity: this._activityState.serialize(),
    };

    return saveState;
  }

  async deserialize(saveData: ISerializedState): Promise<void> {
    const migrator = new Migrator();
    const migratedSaveData = migrator.migrate(saveData);

    if (migrator.hasMigrated) {
      this._notificationsState.pushNotification(
        NotificationType.gameVersionUpdated,
        msg('Game version has been updated.'),
      );
    }

    if (!migratedSaveData) {
      await this.startNewState();
      return;
    }

    await this._settingsState.deserialize(migratedSaveData.settings);
    await this._globalState.deserialize(migratedSaveData.global);
    await this._scenarioState.deserialize(migratedSaveData.scenario);
    await this._factionState.deserialize(migratedSaveData.faction);
    await this._unlockState.deserialize(migratedSaveData.unlock);
    await this._clonesState.deserialize(migratedSaveData.clones);
    await this._cityState.deserialize(migratedSaveData.city);
    await this._mainframeState.deserialize(migratedSaveData.mainframe);
    await this._automationState.deserialize(migratedSaveData.automation);
    await this._activityState.deserialize(migratedSaveData.activity);

    this._globalState.recalculate();
    this._growthState.clearValues();
    this._unlockState.recalculate();
  }

  private processTicks(maxUpdates: number): number {
    let ticksProcessed = 0;

    for (; ticksProcessed < maxUpdates && this._globalState.time.checkTimeForNextTick(); ticksProcessed++) {
      this.processSingleTick();
    }

    this._growthState.resetValues();

    return ticksProcessed;
  }

  private processSingleTick = () => {
    this._activityState.processTick();
    this._mainframeState.processes.processTick();
    this._clonesState.recalculate();
    this._globalState.makeNextTick();
    this._cityState.recalculate();
    this._globalState.recalculate();
    this._unlockState.recalculate();
  };
}
