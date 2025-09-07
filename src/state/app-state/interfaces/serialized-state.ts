import { IFactionSerializedState } from '@state/faction-state';
import { ISettingsSerializedState } from '@state/settings-state';
import { ICitySerializedState } from '@state/city-state';
import { IMainframeSerializedState } from '@state/mainframe-state';
import { IGlobalSerializedState } from '@state/global-state';
import { IAutomationSerializedState } from '@state/automation-state';
import { ICompanySerializedState } from '@state/company-state';
import { IScenarioSerializedState } from '@state/scenario-state';
import { IUnlockSerializedState } from '@state/unlock-state';
import { GameVersion } from '@shared/types';

export interface ISerializedState {
  gameVersion: GameVersion;
  faction: IFactionSerializedState;
  scenario: IScenarioSerializedState;
  unlock: IUnlockSerializedState;
  global: IGlobalSerializedState;
  settings: ISettingsSerializedState;
  city: ICitySerializedState;
  mainframe: IMainframeSerializedState;
  automation: IAutomationSerializedState;
  company: ICompanySerializedState;
}
