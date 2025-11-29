import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type ISettingsState } from '@state/settings-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { DISTRICT_TYPE_REWARD_PARAMETERS, DistrictTypeRewardParameter, IncomeSource } from '@shared/index';
import { ISidejob } from '../sidejobs-factory';
import { ISerializedSidejobActivity, ISidejobActivity } from './interfaces';
import { type IActivityState } from '../../interfaces';

const { lazyInject } = decorators;

export class SidejobActivity implements ISidejobActivity {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _id: string;

  private _active: boolean;

  private _sidejob: ISidejob;

  constructor(args: ISerializedSidejobActivity) {
    this._id = args.id;
    this._sidejob = this._activityState.sidejobsFactory.makeSidejob(args.sidejob);
    this._active = false;

    this._stateUiConnector.registerEventEmitter(this, ['_active']);
  }

  get id(): string {
    return this._id;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean) {
    this._active = value;
  }

  get sidejob(): ISidejob {
    return this._sidejob;
  }

  perform() {
    for (const parameter of DISTRICT_TYPE_REWARD_PARAMETERS) {
      this.increaseReward(parameter);
    }
  }

  serialize(): ISerializedSidejobActivity {
    return {
      id: this._id,
      sidejob: this._sidejob.serialize(),
    };
  }

  removeAllEventListeners(): void {
    this._stateUiConnector.unregisterEventEmitter(this);
  }

  private increaseReward(parameter: DistrictTypeRewardParameter) {
    const passedTime = this._settingsState.updateInterval;
    const delta = this._sidejob.calculateParameterDelta(parameter, passedTime);

    switch (parameter) {
      case DistrictTypeRewardParameter.money:
        this._globalState.money.increase(delta, IncomeSource.sidejob);
        break;

      case DistrictTypeRewardParameter.developmentPoints:
        this._globalState.development.increase(delta, IncomeSource.sidejob);
        break;

      case DistrictTypeRewardParameter.experience:
        this._sidejob.assignedClone.increaseExperience(delta, true);
        break;

      case DistrictTypeRewardParameter.connectivity:
        this._sidejob.district.parameters.connectivity.increasePoints(delta);
        break;

      case DistrictTypeRewardParameter.rewards:
        this._sidejob.district.parameters.rewards.increasePoints(delta);
        break;

      case DistrictTypeRewardParameter.codeBase:
        this._sidejob.district.parameters.multipliers.codeBase.increasePoints(delta);
        break;

      case DistrictTypeRewardParameter.computationalBase:
        this._sidejob.district.parameters.multipliers.computationalBase.increasePoints(delta);
        break;

      case DistrictTypeRewardParameter.influence:
        this._sidejob.district.parameters.influence.increasePoints(delta);
        break;
    }
  }
}
