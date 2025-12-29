import { BaseController, MS_IN_SECOND, Language, LongNumberFormat, Theme } from '@shared/index';

export class SettingsFormController extends BaseController {
  get language(): Language {
    return this.settingsState.language;
  }

  get theme(): Theme {
    return this.settingsState.theme;
  }

  get messageLogSize(): number {
    return this.settingsState.messageLogSize;
  }

  get toastDuration(): number {
    return this.settingsState.toastDuration;
  }

  get fps(): number {
    return MS_IN_SECOND / this.settingsState.updateInterval;
  }

  get autosaveEnabledOnHide(): boolean {
    return this.settingsState.autosaveEnabledOnHide;
  }

  get autosaveInterval(): number {
    return this.settingsState.autosaveInterval;
  }

  get fastSpeedMultiplier(): number {
    return this.settingsState.fastSpeedMultiplier;
  }

  get maxUpdatesPerTick(): number {
    return this.settingsState.maxUpdatesPerTick;
  }

  get longNumberFormat(): LongNumberFormat {
    return this.settingsState.longNumberFormat;
  }

  async setLanguage(language: Language) {
    await this.settingsState.setLanguage(language);
  }

  setTheme(theme: Theme) {
    this.settingsState.setTheme(theme);
  }

  setMessageLogSize(messageLogSize: number) {
    this.settingsState.setMessageLogSize(messageLogSize);
  }

  setToastDuration(duration: number) {
    this.settingsState.setToastDuration(duration);
  }

  setUpdateFPS(fps: number) {
    this.settingsState.setUpdateInterval(MS_IN_SECOND / fps);
  }

  setAutosaveEnabled(autosaveEnabled: boolean) {
    this.settingsState.setAutosaveEnabledOnHide(autosaveEnabled);
  }

  setAutosaveInterval(autosaveInterval: number) {
    this.settingsState.setAutosaveInterval(autosaveInterval);
  }

  setFastSpeedMultiplier(fastSpeedMultiplier: number) {
    this.settingsState.setFastSpeedMultiplier(fastSpeedMultiplier);
  }

  setMaxUpdatesPerTick(maxUpdatesPerTick: number) {
    this.settingsState.setMaxUpdatesPerTick(maxUpdatesPerTick);
  }

  setLongNumberFormat(longNumberFormat: LongNumberFormat) {
    this.settingsState.setLongNumberFormat(longNumberFormat);
  }
}
