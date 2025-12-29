import { Hotkey, BaseController } from '@shared/index';

export class SavefilePanelController extends BaseController {
  getSaveGameHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.saveGame);
  }

  saveGame() {
    this.app.saveGame();
  }

  importSavefile(file: File) {
    this.app.importSavefile(file);
  }

  exportSavefile() {
    this.app.exportSavefile();
  }

  async deleteSaveData() {
    await this.app.deleteSaveData();
  }

  async restoreDefaultSettings() {
    await this.settingsState.restoreDefaultSettings();
  }
}
