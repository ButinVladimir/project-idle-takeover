import { DistrictMultipliers } from './multipliers/district-multipliers';
import {
  IDistrictInfluenceParameter,
  IDistrictSerializedParameters,
  IDistrictState,
  IDistrictParameters,
  IDistrictConnectivityParameter,
  IDistrictMultipliers,
  IDistrictSynchronizationParameter,
  IDistrictProcessCompletionSpeedParameter,
  IDistrictRewardsParameter,
  IDistrictExperienceShareMultiplierParameter,
} from '../interfaces';
import { DistrictConnectivityParameter } from './district-connectivity-parameter';
import { DistrictInfluenceParameter } from './district-influence-parameter';
import { DistrictSynchronizationParameter } from './district-synchronization-parameter';
import { DistrictRewardsParameter } from './district-rewards-parameter';
import { DistrictProcessCompletionSpeedParameter } from './district-process-completion-speed-parameter';
import { DistrictExperienceShareMultiplierParameter } from './district-experience-share-multiplier-parameter';

export class DistrictParameters implements IDistrictParameters {
  private _tier: IDistrictInfluenceParameter;

  private _connectivity: IDistrictConnectivityParameter;

  private _rewards: IDistrictRewardsParameter;

  private _synchronization: IDistrictSynchronizationParameter;

  private _multipliers: IDistrictMultipliers;

  private _processCompletionSpeed: IDistrictProcessCompletionSpeedParameter;

  private _experienceShareMultiplier: IDistrictExperienceShareMultiplierParameter;

  constructor(districtState: IDistrictState) {
    this._tier = new DistrictInfluenceParameter(districtState);
    this._connectivity = new DistrictConnectivityParameter(districtState);
    this._rewards = new DistrictRewardsParameter(districtState);
    this._synchronization = new DistrictSynchronizationParameter(districtState);
    this._multipliers = new DistrictMultipliers(districtState);
    this._processCompletionSpeed = new DistrictProcessCompletionSpeedParameter(districtState);
    this._experienceShareMultiplier = new DistrictExperienceShareMultiplierParameter(districtState);
  }

  get influence() {
    return this._tier;
  }

  get synchronization() {
    return this._synchronization;
  }

  get connectivity() {
    return this._connectivity;
  }

  get rewards() {
    return this._rewards;
  }

  get multipliers() {
    return this._multipliers;
  }

  get processCompletionSpeed() {
    return this._processCompletionSpeed;
  }

  get experienceShareMultiplier() {
    return this._experienceShareMultiplier;
  }

  recalculate(): void {
    this._tier.recalculate();
    this._connectivity.recalculate();
    this._rewards.recalculate();
  }

  serialize(): IDistrictSerializedParameters {
    return {
      tier: this._tier.serialize(),
      connectivtiy: this._connectivity.serialize(),
      multipliers: this._multipliers.serialize(),
      rewards: this._rewards.serialize(),
    };
  }

  deserialize(serializedParameters: IDistrictSerializedParameters): void {
    this._tier.deserialize(serializedParameters.tier);
    this._connectivity.deserialize(serializedParameters.connectivtiy);
    this._multipliers.deserialize(serializedParameters.multipliers);
    this._rewards.deserialize(serializedParameters.rewards);
  }

  removeAllEventListeners(): void {
    this._tier.removeAllEventListeners();
    this._synchronization.removeAllEventListeners();
    this._processCompletionSpeed.removeAllEventListeners();
  }
}
