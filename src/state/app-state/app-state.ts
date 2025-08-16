import { inject, injectable } from 'inversify';
import { msg } from '@lit/localize';
import type { INotificationsState } from '@state/notifications-state/interfaces/notifications-state';
import type { ISettingsState } from '@state/settings-state/interfaces/settings-state';
import type { ICityState } from '@state/city-state/interfaces/city-state';
import type { IMainframeState } from '@state/mainframe-state/interfaces/mainframe-state';
import type { IGlobalState } from '@state/global-state/interfaces/global-state';
import type { IAutomationState } from '@state/automation-state/interfaces/automation-state';
import type { IGrowthState } from '@state/growth-state/interfaces/growth-state';
import type { ICompanyState } from '@state/company-state/interfaces/company-state';
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

  @inject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

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
    await this._cityState.startNewState();
    await this._mainframeState.startNewState();
    await this._automationState.startNewState();
    await this._companyState.startNewState();

    this._globalState.recalculate();
    this._growthState.clearValues();
  }

  serialize(): ISerializedState {
    const saveState: ISerializedState = {
      gameVersion: CURRENT_VERSION,
      global: this._globalState.serialize(),
      settings: this._settingsState.serialize(),
      city: this._cityState.serialize(),
      mainframe: this._mainframeState.serialize(),
      automation: this._automationState.serialize(),
      company: this._companyState.serialize(),
    };

    return saveState;
  }

  async deserialize(saveData: ISerializedState): Promise<void> {
    const migrator = new Migrator();
    const migratedSaveData = migrator.migrate(saveData);

    if (migrator.hasMigrated) {
      this._notificationsState.pushNotification(
        NotificationType.gameVersionUpdated,
        msg('Game version has been updated'),
      );
    }

    if (!migratedSaveData) {
      await this.startNewState();
      return;
    }

    await this._settingsState.deserialize(migratedSaveData.settings);
    await this._globalState.deserialize(migratedSaveData.global);
    await this._cityState.deserialize(migratedSaveData.city);
    await this._mainframeState.deserialize(migratedSaveData.mainframe);
    await this._automationState.deserialize(migratedSaveData.automation);
    await this._companyState.deserialize(migratedSaveData.company);

    this._globalState.recalculate();
    this._growthState.clearValues();
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
    this._mainframeState.processes.processTick();
    this._companyState.processTick();
    this._globalState.makeNextTick();
    this._cityState.recalculate();
    this._globalState.recalculate();
  };
}
