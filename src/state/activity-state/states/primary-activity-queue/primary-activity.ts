import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { DistrictTypeRewardParameter, IncomeSource } from '@shared/index';
import { IClone } from '@state/clones-state';
import { type IActivityState } from '../../interfaces';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IDistrictState } from '@state/city-state';
import { IPrimaryActivity, ISerializedPrimaryActivity } from './interfaces';
import { PrimaryActivityState, PrimaryActivityPerformResult, PrimaryActivityType } from './types';

const { lazyInject } = decorators;

export abstract class PrimaryActivity implements IPrimaryActivity {
  @lazyInject(TYPES.ActivityState)
  protected _activityState!: IActivityState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _activityId: string;
  private _state: PrimaryActivityState;
  protected _parameterRewardsMap: Map<DistrictTypeRewardParameter, number>;

  constructor(serializedActivity: ISerializedPrimaryActivity) {
    this._activityId = serializedActivity.activityId;
    this._state = serializedActivity.state;
    this._parameterRewardsMap = new Map<DistrictTypeRewardParameter, number>();

    for (const [parameter, value] of Object.entries(serializedActivity.parameterRewards)) {
      this._parameterRewardsMap.set(parameter as DistrictTypeRewardParameter, value);
    }

    this._stateUiConnector.registerEventEmitter(this, ['_activityId', '_state', '_parameterRewardsMap']);
  }

  get activityId(): string {
    return this._activityId;
  }

  abstract get type(): PrimaryActivityType;

  abstract get assignmentId(): string;

  abstract get incomeSource(): IncomeSource;

  abstract get assignedClones(): IClone[];

  abstract get district(): IDistrictState;

  get state(): PrimaryActivityState {
    return this._state;
  }

  protected set state(value: PrimaryActivityState) {
    this._state = value;
  }

  getParameterReward(parameter: DistrictTypeRewardParameter): number | undefined {
    return this._parameterRewardsMap.get(parameter);
  }

  abstract getActivityAddedMessage(): string;

  abstract getActivityCancelledMessage(): string;

  abstract start(): boolean;

  abstract perform(): PrimaryActivityPerformResult;

  abortCurrentCompletion() {
    this._state = PrimaryActivityState.inactive;

    this._activityState.requestReassignment();
  }

  serialize(): ISerializedPrimaryActivity {
    return {
      activityId: this._activityId,
      type: this.type,
      state: this._state,
      parameterRewards: Object.fromEntries(this._parameterRewardsMap.entries()) as Record<
        DistrictTypeRewardParameter,
        number
      >,
    };
  }

  removeAllEventListeners() {
    this._stateUiConnector.unregisterEventEmitter(this);
  }
}
