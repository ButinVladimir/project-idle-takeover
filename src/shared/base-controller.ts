import { ReactiveController, ReactiveControllerHost } from 'lit';
import { IStateUIConnector } from '@state/state-ui-connector';
import { IAppState } from '@state/app-state';
import { IGlobalState } from '@state/global-state';
import { ISettingsState } from '@state/settings-state';
import { ICityState } from '@state/city-state';
import { IMessageLogState } from '@state/message-log-state';
import { IMainframeState } from '@state/mainframe-state';
import { INotificationsState } from '@state/notifications-state';
import { IGrowthState } from '@state/growth-state';
import { IAutomationState } from '@state/automation-state';
import { ICompanyState } from '@state/company-state';
import { IScenarioState } from '@state/scenario-state';
import { IUnlockState } from '@state/unlock-state';
import { IFactionState } from '@state/faction-state';
import { container } from '@state/container';
import { TYPES } from '@state/types';
import { IApp } from '@state/app';
import { IFormatter } from './interfaces';

export type PartialUpdateFunction = () => void;

export class BaseController<T extends ReactiveControllerHost & HTMLElement = ReactiveControllerHost & HTMLElement>
  implements ReactiveController
{
  private static _containerValuesCache = new Map<symbol, any>();

  private static getContainerValue<T>(type: symbol): T {
    let result = BaseController._containerValuesCache.get(type);

    if (!result) {
      result = container.get<T>(type);
      BaseController._containerValuesCache.set(type, result);
    }

    return result;
  }

  protected host: T;

  constructor(host: T) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {}

  hostDisconnected() {}

  protected get stateUiConnector(): IStateUIConnector {
    return BaseController.getContainerValue(TYPES.StateUIConnector);
  }

  public get formatter(): IFormatter {
    return BaseController.getContainerValue(TYPES.Formatter);
  }

  protected get app(): IApp {
    return BaseController.getContainerValue(TYPES.App);
  }

  protected get appState(): IAppState {
    return BaseController.getContainerValue(TYPES.AppState);
  }

  protected get scenarioState(): IScenarioState {
    return BaseController.getContainerValue(TYPES.ScenarioState);
  }

  protected get factionState(): IFactionState {
    return BaseController.getContainerValue(TYPES.FactionState);
  }

  protected get unlockState(): IUnlockState {
    return BaseController.getContainerValue(TYPES.UnlockState);
  }

  protected get globalState(): IGlobalState {
    return BaseController.getContainerValue(TYPES.GlobalState);
  }

  protected get growthState(): IGrowthState {
    return BaseController.getContainerValue(TYPES.GrowthState);
  }

  protected get settingsState(): ISettingsState {
    return BaseController.getContainerValue(TYPES.SettingsState);
  }

  protected get cityState(): ICityState {
    return BaseController.getContainerValue(TYPES.CityState);
  }

  protected get messageLogState(): IMessageLogState {
    return BaseController.getContainerValue(TYPES.MessageLogState);
  }

  protected get notificationsState(): INotificationsState {
    return BaseController.getContainerValue(TYPES.NotificationsState);
  }

  protected get mainframeState(): IMainframeState {
    return BaseController.getContainerValue(TYPES.MainframeState);
  }

  protected get automationState(): IAutomationState {
    return BaseController.getContainerValue(TYPES.AutomationState);
  }

  protected get companyState(): ICompanyState {
    return BaseController.getContainerValue(TYPES.CompanyState);
  }
}
