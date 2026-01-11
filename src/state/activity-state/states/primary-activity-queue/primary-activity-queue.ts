import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg } from '@lit/localize';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IActivityState } from '../../interfaces';
import { type IGlobalState } from '@state/global-state';
import { type IMessageLogState } from '@state/message-log-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import {
  DISTRICT_TYPE_REWARD_PARAMETERS,
  DistrictTypeRewardParameter,
  PrimaryActivitiesEvent,
  removeElementsFromArray,
} from '@shared/index';
import {
  IPrimaryActivity,
  IPrimaryActivityArgs,
  IPrimaryActivityQueue,
  ISerializedContractActivity,
  ISerializedPrimaryActivityQueue,
} from './interfaces';
import { ContractActivity } from './activities/contract-activity';
import { PrimaryActivityPerformResult, PrimaryActivityState } from './types';

const { lazyInject } = decorators;

@injectable()
export class PrimaryActivityQueue implements IPrimaryActivityQueue {
  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _activitiesList: IPrimaryActivity[];
  private _activityIdMap: Map<string, IPrimaryActivity>;
  private _activityAssignmentIdMap: Map<string, IPrimaryActivity>;

  constructor() {
    this._activitiesList = [];
    this._activityIdMap = new Map<string, IPrimaryActivity>();
    this._activityAssignmentIdMap = new Map<string, IPrimaryActivity>();

    this._stateUiConnector.registerEventEmitter(this, [
      '_activitiesList',
      '_activityIdMap',
      '_activityAssignmentIdMap',
    ]);
  }

  addActivity(primaryActivityArgs: IPrimaryActivityArgs): boolean {
    const assignedActivity = this.getActivityByAssignmentId(primaryActivityArgs.assignmentId);

    if (assignedActivity) {
      return false;
    }

    let activity: IPrimaryActivity;

    switch (primaryActivityArgs.type) {
      case 'contract':
        activity = new ContractActivity({
          activityId: uuid(),
          type: 'contract',
          contractAssignmentId: primaryActivityArgs.assignmentId,
          parameterRewards: {} as Record<DistrictTypeRewardParameter, number>,
          passedTime: 0,
          state: PrimaryActivityState.inactive,
        });
    }

    this._activitiesList.push(activity);
    this._activityIdMap.set(activity.activityId, activity);
    this._activityAssignmentIdMap.set(activity.assignmentId, activity);

    this._activityState.requestReassignment();

    this._messageLogState.postMessage(PrimaryActivitiesEvent.primaryActivityAdded, activity.getActivityAddedMessage());

    return true;
  }

  listActivities(): IPrimaryActivity[] {
    return this._activitiesList;
  }

  getActivityById(id: string): IPrimaryActivity | undefined {
    return this._activityIdMap.get(id);
  }

  getActivityByAssignmentId(assignmentId: string): IPrimaryActivity | undefined {
    return this._activityAssignmentIdMap.get(assignmentId);
  }

  cancelActivityById(id: string): void {
    const activityIndex = this._activitiesList.findIndex((activity) => activity.activityId === id);

    if (activityIndex !== -1) {
      removeElementsFromArray(this._activitiesList, activityIndex, 1);
    }

    const activity = this.getActivityById(id);

    if (activity) {
      this._activityIdMap.delete(id);
      this._activityAssignmentIdMap.delete(activity.assignmentId);
      activity.removeAllEventListeners();

      this._messageLogState.postMessage(
        PrimaryActivitiesEvent.primaryActivityCancelled,
        activity.getActivityCancelledMessage(),
      );
    }

    this._activityState.requestReassignment();
  }

  cancelActivitiesByAssignmentId(assignmentId: string): void {
    const activity = this.getActivityByAssignmentId(assignmentId);

    if (activity) {
      this.cancelActivityById(activity.activityId);
    }

    this._activityState.requestReassignment();
  }

  cancelAllActivities(): void {
    this.clearState();
    this._activityState.requestReassignment();

    this._messageLogState.postMessage(
      PrimaryActivitiesEvent.allPrimaryActivitiesCancelled,
      msg('All primary activities have been cancelled'),
    );
  }

  perform() {
    for (const activity of this._activitiesList) {
      if (activity.state !== PrimaryActivityState.active) {
        continue;
      }

      const performanceResult = activity.perform();

      if (performanceResult === PrimaryActivityPerformResult.continue) {
        continue;
      }

      if (performanceResult === PrimaryActivityPerformResult.reward) {
        this.rewardActivity(activity);
        this._activityState.requestReassignment();
      }
    }
  }

  filterActivities(): void {
    let index = 0;

    while (index < this._activitiesList.length) {
      const activity = this._activitiesList[index];

      if (activity.state === PrimaryActivityState.toBeRemoved) {
        removeElementsFromArray(this._activitiesList, index, 1);
        this._activityIdMap.delete(activity.activityId);
        this._activityAssignmentIdMap.delete(activity.assignmentId);
        activity.removeAllEventListeners();
      } else {
        index++;
      }
    }
  }

  async startNewState(): Promise<void> {
    this.clearState();
  }

  async deserialize(serializedState: ISerializedPrimaryActivityQueue): Promise<void> {
    this.clearState();

    for (const serializedActivity of serializedState.activities) {
      let activity: IPrimaryActivity;

      switch (serializedActivity.type) {
        case 'contract':
          activity = new ContractActivity(serializedActivity as ISerializedContractActivity);
      }

      this._activitiesList.push(activity);
      this._activityIdMap.set(activity.activityId, activity);
      this._activityAssignmentIdMap.set(activity.assignmentId, activity);
    }
  }

  serialize(): ISerializedPrimaryActivityQueue {
    return {
      activities: this._activitiesList.map((activity) => activity.serialize()),
    };
  }

  private clearState() {
    for (const activity of this._activitiesList) {
      activity.removeAllEventListeners();
    }

    this._activitiesList.length = 0;
    this._activityIdMap.clear();
    this._activityAssignmentIdMap.clear();
  }

  private rewardActivity(activity: IPrimaryActivity): void {
    for (const parameter of DISTRICT_TYPE_REWARD_PARAMETERS) {
      const delta = activity.getParameterReward(parameter);

      if (delta === undefined) {
        continue;
      }

      switch (parameter) {
        case DistrictTypeRewardParameter.money:
          this._globalState.money.increase(delta, activity.incomeSource);
          break;
        case DistrictTypeRewardParameter.developmentPoints:
          this._globalState.development.increase(delta, activity.incomeSource);
          break;
        case DistrictTypeRewardParameter.experience:
          activity.assignedClones.forEach((clone) => {
            clone.increaseExperience(delta, true);
          });
          break;
        case DistrictTypeRewardParameter.connectivity:
          activity.district.parameters.connectivity.increasePoints(delta);
          break;
        case DistrictTypeRewardParameter.influence:
          activity.district.parameters.influence.increasePoints(delta);
          break;
        case DistrictTypeRewardParameter.rewards:
          activity.district.parameters.rewards.increasePoints(delta);
          break;
        case DistrictTypeRewardParameter.codeBase:
          activity.district.parameters.multipliers.codeBase.increasePoints(delta);
          break;
        case DistrictTypeRewardParameter.computationalBase:
          activity.district.parameters.multipliers.computationalBase.increasePoints(delta);
          break;
      }
    }
  }
}
