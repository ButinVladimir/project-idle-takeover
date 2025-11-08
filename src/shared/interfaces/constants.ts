import { MainframeHardwareParameterType } from '@state/mainframe-state/states/mainframe-hardware-state/types';
import { Feature, Hotkey, LongNumberFormat } from '../types';

export interface IConstants {
  startingScenario: string;
  defaultSettings: {
    messageLogSize: number;
    toastDuration: number;
    updateInterval: number;
    autosaveEnabledOnHide: boolean;
    autosaveInterval: number;
    fastSpeedMultiplier: number;
    maxUpdatesPerTick: number;
    longNumberFormat: LongNumberFormat;
    hotkeys: Record<Hotkey, string>;
  };
  defaultAutomationSettings: {
    mainframeHardwareAutobuyer: {
      moneyShare: number;
      priority: MainframeHardwareParameterType[];
    };
    mainframeProgramsAutobuyer: {
      moneyShare: number;
    };
    cloneLevelAutoupgrader: {
      moneyShare: number;
    };
  };
  menuUnlockRequirements: Record<string, Feature | undefined>;
}
