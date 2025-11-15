import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { TYPES } from '@state/types';
import { type IActivityState } from '@state/activity-state';
import { IDistrictExperienceShareMultiplierParameter, IDistrictState } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictExperienceShareMultiplierParameter implements IDistrictExperienceShareMultiplierParameter {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _district: IDistrictState;
  private _value: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._value = 1;

    this._stateUIConnector.registerEventEmitter(this, ['_value']);
  }

  get value(): number {
    return this._value;
  }

  recalculate(): void {
    this._value = 1;

    for (const sidejob of this._activityState.sidejobs.listSidejobs()) {
      if (sidejob.district.index === this._district.index && sidejob.isActive) {
        this._value += sidejob.calculateExperienceShareMultiplierDelta();
      }
    }
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }
}
