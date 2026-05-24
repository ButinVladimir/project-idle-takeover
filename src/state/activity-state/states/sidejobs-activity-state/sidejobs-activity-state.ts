import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import { removeElementsFromArray, SidejobsEvent } from '@shared/index';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IMessageLogState } from '@state/message-log-state';
import { TYPES } from '@state/types';
import { DISTRICT_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { type IActivityState } from '../../interfaces';
import {
  ISidejobsActivityState,
  ISidejobActivity,
  ISidejobsActivitySerializedState,
  ISerializedSidejobActivity,
} from './interfaces';
import { SidejobsBatchValidationResult, type ISidejobActivityValidator } from '../sidejob-activity-validator';
import { SidejobActivity } from './sidejob-activity';

const { lazyInject } = decorators;

export class SidejobsActivityState implements ISidejobsActivityState {
  @lazyInject(TYPES.SidejobActivityValidator)
  private _sidejobActivityValidator!: ISidejobActivityValidator;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _activitiesList: ISidejobActivity[];
  private _activityCloneIdMap: Map<string, ISidejobActivity>;
  private _activityMap: Map<string, ISidejobActivity>;

  constructor() {
    this._activitiesList = [];
    this._activityCloneIdMap = new Map<string, ISidejobActivity>();
    this._activityMap = new Map<string, ISidejobActivity>();

    this._stateUIConnector.registerEventEmitter(this, ['_activitiesList']);
  }

  listActivities(): ISidejobActivity[] {
    return this._activitiesList;
  }

  getActivityByCloneId(cloneId: string): ISidejobActivity | undefined {
    return this._activityCloneIdMap.get(cloneId);
  }

  getActivityById(sidejobId: string): ISidejobActivity | undefined {
    return this._activityMap.get(sidejobId);
  }

  assignSidejobs(sidejobName: string, district: IDistrictState, clones: IClone[]): boolean {
    if (
      this._sidejobActivityValidator.validateSidejobsBatch(sidejobName, district, clones) !==
      SidejobsBatchValidationResult.valid
    ) {
      return false;
    }

    const activities: SidejobActivity[] = clones.map(
      (clone) =>
        new SidejobActivity({
          id: uuid(),
          sidejob: {
            sidejobName: sidejobName,
            districtIndex: district.index,
            assignedCloneId: clone.id,
          },
          enabled: true,
        }),
    );

    this.addActivities(activities);
    this._activityState.requestReassignment();

    for (const activity of activities) {
      this._messageLogState.postMessage(
        SidejobsEvent.sidejobAssigned,
        msg(
          str`Sidejob "${SIDEJOB_TEXTS[activity.sidejob.sidejobName].title()}" in district "${DISTRICT_NAMES[activity.sidejob.district.name]()}" has been assigned to clone "${activity.sidejob.assignedClone.name}"`,
        ),
      );
    }

    return true;
  }

  cancelActivity(sidejobId: string): void {
    const activity = this.getActivityById(sidejobId);

    if (activity) {
      this.handleCancelActivity(activity);

      this._messageLogState.postMessage(
        SidejobsEvent.sidejobCancelled,
        msg(
          str`Sidejob "${SIDEJOB_TEXTS[activity.sidejob.sidejobName].title()}" in district "${DISTRICT_NAMES[activity.sidejob.district.name]()}" assigned to clone "${activity.sidejob.assignedClone.name}" has been cancelled`,
        ),
      );
    }

    this._activityState.requestReassignment();
  }

  cancelActivities(sidejobIds: string[]): void {
    for (const sidejobId of sidejobIds) {
      const activity = this.getActivityById(sidejobId);

      if (activity) {
        this.handleCancelActivity(activity);
      }
    }

    this._messageLogState.postMessage(
      SidejobsEvent.displayedSidejobsCancelled,
      msg('Displayed sidejobs have been cancelled'),
    );

    this._activityState.requestReassignment();
  }

  perform(): void {
    for (const activity of this._activitiesList) {
      if (activity.active) {
        activity.perform();
      }
    }
  }

  async startNewState(): Promise<void> {
    this.clearActivities();
  }

  async deserialize(serializedState: ISidejobsActivitySerializedState): Promise<void> {
    this.clearActivities();

    const activities = serializedState.activities.map((serializedActivity) => new SidejobActivity(serializedActivity));

    this.addActivities(activities);
    this._activityState.requestReassignment();
  }

  serialize(): ISidejobsActivitySerializedState {
    return {
      activities: this._activitiesList.map(this.serializeSidejob),
    };
  }

  private serializeSidejob = (activity: ISidejobActivity): ISerializedSidejobActivity => {
    return activity.serialize();
  };

  private addActivity(activity: ISidejobActivity) {
    const existingSidejobByClone = this.getActivityByCloneId(activity.sidejob.assignedClone.id);

    if (existingSidejobByClone) {
      this.cancelActivity(existingSidejobByClone.id);
    }

    this._activitiesList.push(activity);
    this._activityMap.set(activity.id, activity);
    this._activityCloneIdMap.set(activity.sidejob.assignedClone.id, activity);
  }

  private addActivities(activities: ISidejobActivity[]) {
    activities.forEach((activity) => this.addActivity(activity));
  }

  private clearActivities() {
    for (const activity of this._activitiesList) {
      this.handleActivityCleanup(activity);
    }

    this._activitiesList.length = 0;
    this._activityCloneIdMap.clear();
    this._activityMap.clear();

    this._activityState.requestReassignment();
  }

  private handleCancelActivity(activity: ISidejobActivity) {
    const index = this._activitiesList.findIndex((sidejob) => sidejob.id === activity.id);

    if (index >= 0) {
      removeElementsFromArray(this._activitiesList, index, 1);
    }

    this.handleActivityCleanup(activity);

    this._activityMap.delete(activity.id);
    this._activityCloneIdMap.delete(activity.sidejob.assignedClone.id);
  }

  private handleActivityCleanup(activity: ISidejobActivity) {
    activity.active = false;
    activity.removeAllEventListeners();
  }
}
