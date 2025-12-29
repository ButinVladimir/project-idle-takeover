import { inject, injectable } from 'inversify';
import { msg } from '@lit/localize';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import type { IAppState } from '@state/app-state/interfaces/app-state';
import { ISerializedState } from '@state/app-state/interfaces/serialized-state';
import type { IMessageLogState } from '@state/message-log-state/interfaces/message-log-state';
import type { ISettingsState } from '@state/settings-state/interfaces/settings-state';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import { TYPES } from '@state/types';
import { GameStateEvent } from '@shared/types';
import { IApp } from './interfaces';
import { LOCAL_STORAGE_KEY, REFRESH_UI_TIME } from './constants';
import { AppStage } from './types';
import { decorators } from '../container';

const { lazyInject } = decorators;

@injectable()
export class App implements IApp {
  @inject(TYPES.AppState)
  private _appState!: IAppState;

  @inject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @inject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _appStage: AppStage;
  private _updateTimer?: NodeJS.Timeout;
  private _autosaveTimer?: NodeJS.Timeout;
  private _uiVisible: boolean;

  constructor() {
    this._appStage = AppStage.loading;
    this._updateTimer = undefined;
    this._autosaveTimer = undefined;
    this._uiVisible = true;

    this._stateUIConnector.registerEventEmitter(this, ['_appStage']);

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  get appStage() {
    return this._appStage;
  }

  async startUp(): Promise<void> {
    this.startLoadingGame();

    const saveData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (saveData) {
      try {
        await this.deserializeState(saveData);
      } catch (e) {
        console.error(e);
        await this._appState.startNewState();
      }
    } else {
      await this._appState.startNewState();
    }

    this.startRunningGame();
  }

  saveGame = (): void => {
    const encodedSaveData = this.serializeState();

    localStorage.setItem(LOCAL_STORAGE_KEY, encodedSaveData);
    this._messageLogState.postMessage(GameStateEvent.gameSaved, msg('Game has been saved'));
  };

  refreshUI(): void {
    this._appStage = AppStage.loading;
    this.emitChangedAppStageEvent();

    setTimeout(() => {
      this._appStage = AppStage.running;
      this.emitChangedAppStageEvent();
    }, REFRESH_UI_TIME);
  }

  importSavefile(file: File): void {
    this.startLoadingGame();

    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      this.deserializeState(fileReader.result as string)
        .then(() => {
          this.startRunningGame();
        })
        .catch((e) => {
          console.error(e);

          return this._appState.startNewState();
        });
    });

    fileReader.addEventListener('error', () => {
      console.error(`An error occurred during importing file ${file.name}`);
      this.startRunningGame();
    });

    fileReader.readAsText(file);
  }

  exportSavefile(): void {
    const saveData = this.serializeState();
    const savefileName = `project-idle-takeover-savefile-${new Date().toLocaleString()}.txt`;

    const file = new File([saveData], savefileName, { endings: 'transparent' });

    const linkElement = document.createElement('a');
    linkElement.download = savefileName;
    linkElement.href = URL.createObjectURL(file);
    linkElement.click();
    URL.revokeObjectURL(linkElement.href);
  }

  async deleteSaveData(): Promise<void> {
    this.startLoadingGame();

    localStorage.removeItem(LOCAL_STORAGE_KEY);

    try {
      await this.startUp();
    } catch (e) {
      console.error(e);
    }
  }

  restartUpdateTimer() {
    this.stopUpdateTimer();
    this._updateTimer = setInterval(this.updateGame, this._settingsState.updateInterval);
  }

  restartAutosaveTimer() {
    this.stopAutosaveTimer();

    if (this._settingsState.autosaveInterval) {
      this._autosaveTimer = setInterval(this.saveGame, this._settingsState.autosaveInterval);
    }
  }

  fastForward() {
    this._appStage = AppStage.fastForward;

    this.emitChangedAppStageEvent();
  }

  stopFastForwarding() {
    this._appStage = AppStage.running;
    this._messageLogState.postMessage(
      GameStateEvent.fastForwared,
      msg('Spending accumulated time has been interrupted'),
    );
    this.emitChangedAppStageEvent();
  }

  private serializeState(): string {
    return compressToUTF16(JSON.stringify(this._appState.serialize()));
  }

  private async deserializeState(savedState: string): Promise<void> {
    const serializedState = JSON.parse(decompressFromUTF16(savedState)) as ISerializedState;

    await this._appState.deserialize(serializedState);
  }

  private startLoadingGame = (): void => {
    this._appStage = AppStage.loading;

    this.stopUpdateTimer();
    this.stopAutosaveTimer();

    this._messageLogState.clearMessages();

    this.emitChangedAppStageEvent();
  };

  private startRunningGame = (): void => {
    this._appStage = AppStage.running;

    this.restartUpdateTimer();
    this.restartAutosaveTimer();

    this._messageLogState.postMessage(GameStateEvent.gameStarted, msg('Game has been started'));

    this.emitChangedAppStageEvent();
  };

  private emitChangedAppStageEvent() {
    this._stateUIConnector.fireEvents();
  }

  private stopUpdateTimer() {
    if (this._updateTimer) {
      clearInterval(this._updateTimer);
    }

    this._updateTimer = undefined;
  }

  private stopAutosaveTimer() {
    if (this._autosaveTimer) {
      clearInterval(this._autosaveTimer);
    }

    this._autosaveTimer = undefined;
  }

  private updateGame = (): void => {
    switch (this.appStage) {
      case AppStage.running:
        this._appState.updateState();
        break;

      case AppStage.fastForward:
        if (!this._appState.fastForwardState()) {
          this._appStage = AppStage.running;
          this._messageLogState.postMessage(GameStateEvent.fastForwared, msg('Accumulated time has been spent'));
          this.emitChangedAppStageEvent();
        }
        break;
    }

    if (this._uiVisible) {
      this._stateUIConnector.fireEvents();
    }
  };

  private handleVisibilityChange = (): void => {
    this._uiVisible = !document.hidden;

    if (!this._uiVisible) {
      const gameIsRunning = this.appStage === AppStage.fastForward || this.appStage === AppStage.running;
      const autosaveEnabledOnHide = this._settingsState.autosaveEnabledOnHide;

      if (gameIsRunning && autosaveEnabledOnHide) {
        this.saveGame();
      }
    } else {
      this._stateUIConnector.fireEvents();
    }
  };
}
