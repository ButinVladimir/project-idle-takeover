import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state/interfaces';
import { type IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import { type ICompanyState } from '@/state/company-state';
import { type IMessageLogState } from '@state/message-log-state/interfaces/message-log-state';
import { type IFormatter } from '@shared/interfaces/formatter';
import { calculateGeometricProgressionSum, reverseGeometricProgressionSum } from '@shared/helpers';
import { CityEvent } from '@shared/types';
import { DISTRICT_NAMES } from '@texts/names';
import { IDistrictState, IDistrictTierParameter, IDistrictTierSerializedParameter } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictTierParameter implements IDistrictTierParameter {
  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

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
    const { base, multiplier } = districtTypeInfo.parameters.districtTierPoints.requirements;

    return calculateGeometricProgressionSum(tier, multiplier, base);
  }

  recalculate(): void {
    const newTier = this.calculateTierFromPoints();

    if (newTier > this._tier) {
      this._tier = newTier;

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
    this._points = this.getTierRequirements(tier - 1);

    this.handleTierUpdate();
  }

  async deserialize(serializedState: IDistrictTierSerializedParameter): Promise<void> {
    this._points = serializedState.points;
    this._tier = this.calculateTierFromPoints();
  }

  serialize(): IDistrictTierSerializedParameter {
    return {
      points: this._points,
    };
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }

  private calculateTierFromPoints(): number {
    const districtTypeInfo = this._district.template;
    const { base, multiplier } = districtTypeInfo.parameters.districtTierPoints.requirements;

    return reverseGeometricProgressionSum(this._points, multiplier, base);
  }

  private handleTierUpdate() {
    this._globalState.synchronization.requestRecalculation();
    this._companyState.requestReassignment();
    this._companyState.sidejobs.updateAllSidejobsPerformance();
  }
}
