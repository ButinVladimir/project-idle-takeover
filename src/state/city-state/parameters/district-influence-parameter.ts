import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type ICompanyState } from '@/state/company-state';
import { type IMessageLogState } from '@state/message-log-state';
import { type INotificationsState } from '@state/notifications-state';
import { type IScenarioState } from '@state/scenario-state';
import {
  type IFormatter,
  CityEvent,
  NotificationType,
  calculateGeometricProgressionSum,
  reverseGeometricProgressionSum,
} from '@shared/index';
import { DISTRICT_NAMES } from '@texts/index';
import {
  IDistrictState,
  IDistrictInfluenceParameter,
  IDistrictInfluenceSerializedParameter,
  type ICityState,
} from '../interfaces';
import { DistrictUnlockState } from '../types';

const { lazyInject } = decorators;

export class DistrictInfluenceParameter implements IDistrictInfluenceParameter {
  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _district: IDistrictState;
  private _tier: number;
  private _points: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._tier = 0;
    this._points = 0;

    this._stateUIConnector.registerEventEmitter(this, ['_tier']);
  }

  get tier(): number {
    return this._tier;
  }

  get points(): number {
    return this._points;
  }

  increasePoints(delta: number): void {
    this._points += delta;
  }

  getTierRequirements(tier: number): number {
    const districtTypeInfo = this._district.template;
    const { base, multiplier } = districtTypeInfo.parameters.influence.requirements;
    const size = this._cityState.getDistrictSize(this._district.index);

    return calculateGeometricProgressionSum(tier, size * multiplier, base);
  }

  recalculate(): void {
    const newTier = this.calculateTierFromPoints();

    if (newTier > this._tier) {
      this._tier = newTier;

      this.handleDistrictCapture();

      const formattedTier = this._formatter.formatTier(this._tier);
      this._messageLogState.postMessage(
        CityEvent.districtTierIncreased,
        msg(str`District "${DISTRICT_NAMES[this._district.name]()}" tier has been increased to ${formattedTier}`),
      );

      this.handleTierUpdate();
    }
  }

  setTier(tier: number): void {
    this._tier = tier;

    this.handleTierUpdate();
  }

  async deserialize(serializedState: IDistrictInfluenceSerializedParameter): Promise<void> {
    this._points = serializedState.points;
    this._tier = serializedState.tier;
  }

  serialize(): IDistrictInfluenceSerializedParameter {
    return {
      points: this._points,
      tier: this._tier,
    };
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }

  private calculateTierFromPoints(): number {
    const districtTypeInfo = this._district.template;
    const { base, multiplier } = districtTypeInfo.parameters.influence.requirements;
    const size = this._cityState.getDistrictSize(this._district.index);

    return reverseGeometricProgressionSum(this._points, size * multiplier, base);
  }

  private handleDistrictCapture() {
    if (this._district.state !== DistrictUnlockState.captured) {
      const capturedDistrictsCount = this._cityState.getCapturedDistrictsCount();
      this._district.state = DistrictUnlockState.captured;

      this._notificationsState.pushNotification(
        NotificationType.districtCaptured,
        msg(str`District "${DISTRICT_NAMES[this._district.name]()}" has been captured. It's tier now can be increased`),
      );

      this._scenarioState.storyEvents.visitEvents({
        capturedDistrictsCount,
      });
    }
  }

  private handleTierUpdate() {
    this._globalState.synchronization.requestRecalculation();
    this._companyState.requestReassignment();
    this._companyState.sidejobs.updateAllSidejobsPerformance();
  }
}
