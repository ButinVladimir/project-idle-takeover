import { GameSpeed } from '@state/global-state';
import { BaseController, Hotkey } from '@shared/index';

export class GameScreenController extends BaseController {
  hostConnected() {
    super.hostConnected();

    document.addEventListener('keydown', this.handleKeyDown);
  }

  hostDisconnected() {
    super.hostDisconnected();

    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private pause() {
    this.globalState.gameSpeed = GameSpeed.paused;
  }

  private playNormal() {
    this.globalState.gameSpeed = GameSpeed.normal;
  }

  private playFast() {
    this.globalState.gameSpeed = GameSpeed.fast;
  }

  private upgradeMainframeHardware() {
    this.mainframeState.hardware.upgrader.upgradeMaxAllParameters();
  }

  private upgradeMainframePerformance() {
    this.mainframeState.hardware.upgrader.upgradeMaxParameter('performance');
  }

  private upgradeMainframeRam() {
    this.mainframeState.hardware.upgrader.upgradeMaxParameter('ram');
  }

  private upgradeMainframeCores() {
    this.mainframeState.hardware.upgrader.upgradeMaxParameter('cores');
  }

  private upgradeMainframePrograms() {
    this.mainframeState.programs.upgrader.upgradeMaxAllPrograms();
  }

  private upgradeClonesLevel() {
    this.clonesState.ownedClones.levelUpgrader.upgradeMaxAllClones();
  }

  private getHotkeyByKey(key: string): Hotkey | undefined {
    return this.settingsState.hotkeys.getHotkeyByKey(key);
  }

  private saveGame() {
    this.app.saveGame();
  }

  private startContracts() {
    this.automationState.contracts.starter.startAllAssignments();
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const target = event.composedPath()[0];

    if (target instanceof HTMLInputElement) {
      return;
    }

    const key = event.key;
    const hotkey = this.getHotkeyByKey(key);

    if (!hotkey) {
      return;
    }

    switch (hotkey) {
      case Hotkey.pause:
        this.pause();
        break;
      case Hotkey.playNormalSpeed:
        this.playNormal();
        break;
      case Hotkey.playFastSpeed:
        this.playFast();
        break;
      case Hotkey.saveGame:
        this.saveGame();
        break;
      case Hotkey.addContractAssignments:
        this.startContracts();
        break;
      case Hotkey.upgradeMainframeHardware:
        this.upgradeMainframeHardware();
        break;
      case Hotkey.upgradeMainframePerformance:
        this.upgradeMainframePerformance();
        break;
      case Hotkey.upgradeMainframeRam:
        this.upgradeMainframeRam();
        break;
      case Hotkey.upgradeMainframeCores:
        this.upgradeMainframeCores();
        break;
      case Hotkey.upgradeMainframePrograms:
        this.upgradeMainframePrograms();
        break;
      case Hotkey.upgradeClonesLevel:
        this.upgradeClonesLevel();
        break;
    }
  };
}
