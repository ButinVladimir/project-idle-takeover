import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { TYPES } from '@state/types';
import { type IActivityState } from '@state/activity-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { IDistrictProcessCompletionSpeedParameter, IDistrictState } from '../interfaces';

const { lazyInject } = decorators;

export class DistrictProcessCompletionSpeedParameter implements IDistrictProcessCompletionSpeedParameter {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  private _district: IDistrictState;
  private _value: number;

  constructor(district: IDistrictState) {
    this._district = district;
    this._value = 1;

    this._stateUIConnector.registerEventEmitter(this, []);
  }

  get value(): number {
    return this._value;
  }

  recalculate(): void {
    this._value = 1;

    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      if (sidejobActivity.sidejob.district.index === this._district.index && sidejobActivity.active) {
        this._value += sidejobActivity.sidejob.calculateParameterDelta(
          DistrictTypeRewardParameter.processCompletionSpeed,
          1,
        );
      }
    }
  }

  removeAllEventListeners(): void {
    this._stateUIConnector.unregisterEventEmitter(this);
  }
}
