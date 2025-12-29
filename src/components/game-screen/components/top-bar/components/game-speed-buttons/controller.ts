import { Hotkey, BaseController } from '@shared/index';
import { GameSpeed } from '@state/global-state';

export class GameSpeedButtonsController extends BaseController {
  get gameSpeed(): GameSpeed {
    return this.globalState.gameSpeed;
  }

  changeGameSpeed(gameSpeed: GameSpeed) {
    this.globalState.gameSpeed = gameSpeed;

    this.host.requestUpdate();
  }

  fastForward() {
    this.app.fastForward();
  }

  getGameSpeedHotkey(gameSpeed: GameSpeed): string | undefined {
    switch (gameSpeed) {
      case GameSpeed.paused:
        return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.pause);
      case GameSpeed.normal:
        return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.playNormalSpeed);
      case GameSpeed.fast:
        return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.playFastSpeed);
    }
  }
}
