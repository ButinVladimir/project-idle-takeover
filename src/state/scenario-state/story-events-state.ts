import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { MapSpecialEvent, NotificationType } from '@shared/index';
import { STORY_MESSAGES } from '@texts/story';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { type IFactionState } from '@state/faction-state';
import { type ICityState } from '@state/city-state';
import {
  type IScenarioState,
  IStoryEvent,
  IStoryStateValues,
  IStoryEventsState,
  IStoryGoal,
  IStoryEventsSerializedState,
} from './interfaces';
import { StoryGoalState } from './types';
import { typedStoryEvents } from './constants';

const { lazyInject } = decorators;

@injectable()
export class StoryEventsState implements IStoryEventsState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  private _districtsStateRecalculationRequested: boolean;

  private _visitedAllEvents: Set<string>;
  private _visitedScenarioEvents: Set<string>;

  constructor() {
    this._districtsStateRecalculationRequested = false;
    this._visitedAllEvents = new Set<string>();
    this._visitedScenarioEvents = new Set<string>();

    this._stateUiConnector.registerEventEmitter(this, ['_visitedAllEvents', '_visitedScenarioEvents']);
  }

  visitEvents() {
    this._districtsStateRecalculationRequested = false;
    const storyEventsList = this._scenarioState.currentValues.storyEvents;

    const currentState: IStoryStateValues = {
      level: this._globalState.development.level,
      faction: this._factionState.currentFaction,
      capturedDistrictsCount: this._cityState.getCapturedDistrictsCount(),
    };

    for (const storyEventName of storyEventsList) {
      const isStoryEventPassed = this.isStoryEventPassed(storyEventName);
      const canStoryEventBePassed = this.canStoryEventBePassed(storyEventName, currentState);

      if (isStoryEventPassed || !canStoryEventBePassed) {
        continue;
      }

      this.visitSingleStoryEvent(storyEventName);
    }

    this.unlockDistricts();
  }

  listGoals(): IStoryGoal[] {
    const availableGoals: IStoryGoal[] = [];
    const storyEventsList = this._scenarioState.currentValues.storyEvents;

    const currentState: IStoryStateValues = {
      level: this._globalState.development.level,
      faction: this._factionState.currentFaction,
      capturedDistrictsCount: this._cityState.getCapturedDistrictsCount(),
    };

    for (const storyEventName of storyEventsList) {
      const state = this.getStoryGoalState(storyEventName, currentState);
      const storyEvent = typedStoryEvents[storyEventName];

      availableGoals.push({
        ...storyEvent,
        name: storyEventName,
        state,
      });
    }

    return availableGoals;
  }

  isEventUnlocked(storyEventName: string): boolean {
    return this._visitedAllEvents.has(storyEventName);
  }

  async startNewState(): Promise<void> {
    this._visitedAllEvents.clear();
    this._visitedScenarioEvents.clear();
  }

  async deserialize(serializedState: IStoryEventsSerializedState): Promise<void> {
    this._visitedAllEvents.clear();
    serializedState.visitedAllEvents.forEach((storyEventName) => {
      this._visitedAllEvents.add(storyEventName);
    });

    this._visitedScenarioEvents.clear();
    serializedState.visitedScenarioEvents.forEach((storyEventName) => {
      this._visitedScenarioEvents.add(storyEventName);
    });
  }

  serialize(): IStoryEventsSerializedState {
    return {
      visitedAllEvents: Array.from(this._visitedAllEvents.values()),
      visitedScenarioEvents: Array.from(this._visitedScenarioEvents.values()),
    };
  }

  private visitSingleStoryEvent(storyEventName: string) {
    const storyEvent = typedStoryEvents[storyEventName];

    this.processStoryEventMessages(storyEventName, storyEvent);
    this.processStoryEventFeatures(storyEvent);
    this.processStoryEventEvents(storyEvent);
    this.processStoryEventPrograms(storyEvent);
    this.processStoryEventCloneTemplates(storyEvent);
    this.processStoryEventSidejobs(storyEvent);
    this.processStoryEventContracts(storyEvent);

    this._visitedAllEvents.add(storyEventName);
    this._visitedScenarioEvents.add(storyEventName);
  }

  private getStoryGoalState(storyEventName: string, storyStateValues: IStoryStateValues): StoryGoalState {
    if (this.isStoryEventNotAvailable(storyEventName, storyStateValues)) {
      return StoryGoalState.notAvailable;
    }

    if (this.isStoryEventPassed(storyEventName)) {
      return StoryGoalState.passed;
    }

    return StoryGoalState.available;
  }

  private isStoryEventPassed(storyEventName: string): boolean {
    return this._visitedScenarioEvents.has(storyEventName);
  }

  private isStoryEventNotAvailable(storyEventName: string, storyStateValues: IStoryStateValues) {
    const storyEvent = typedStoryEvents[storyEventName];

    if (storyEvent.requirements.faction === undefined) {
      return false;
    }

    if (storyStateValues.faction !== 'neutral' && storyStateValues.faction !== storyEvent.requirements.faction) {
      return true;
    }

    return false;
  }

  private canStoryEventBePassed(storyEventName: string, storyStateValues: IStoryStateValues) {
    const storyEvent = typedStoryEvents[storyEventName];

    if (storyEvent.requirements.level !== undefined && storyStateValues.level < storyEvent.requirements.level) {
      return false;
    }

    if (
      storyEvent.requirements.capturedDistrictsCount !== undefined &&
      storyStateValues.capturedDistrictsCount < storyEvent.requirements.capturedDistrictsCount
    ) {
      return false;
    }

    if (storyEvent.requirements.faction !== undefined && storyStateValues.faction !== storyEvent.requirements.faction) {
      return false;
    }

    return true;
  }

  private unlockSpecialEvent = (event: MapSpecialEvent) => {
    switch (event) {
      case MapSpecialEvent.factionsAvailable:
        this._factionState.makeJoiningFactionAvailable();
        break;
      case MapSpecialEvent.districtUnlocked:
        this._districtsStateRecalculationRequested = true;
        break;
    }
  };

  private unlockDistricts() {
    if (!this._districtsStateRecalculationRequested) {
      return;
    }

    this._districtsStateRecalculationRequested = false;
    this._cityState.recalculateDistrictsState();
  }

  private processStoryEventMessages(storyEventName: string, storyEvent: IStoryEvent) {
    if (!this._visitedAllEvents.has(storyEventName) && storyEvent.messages) {
      storyEvent.messages.forEach((messageKey) => {
        this._notificationsState.pushNotification(NotificationType.storyEvent, STORY_MESSAGES[messageKey]());
      });
    }
  }

  private processStoryEventFeatures(storyEvent: IStoryEvent) {
    if (storyEvent.unlockFeatures) {
      storyEvent.unlockFeatures.forEach((feature) => {
        this._unlockState.features.unlockFeature(feature);
      });
    }
  }

  private processStoryEventEvents(storyEvent: IStoryEvent) {
    if (storyEvent.specialEvents) {
      storyEvent.specialEvents.forEach(this.unlockSpecialEvent);
    }
  }

  private processStoryEventPrograms(storyEvent: IStoryEvent) {
    if (storyEvent.rewardDesigns?.programs) {
      storyEvent.rewardDesigns.programs.forEach((program) => {
        this._unlockState.items.programs.unlockDesign(program, 0, true);
      });
    }
  }

  private processStoryEventCloneTemplates(storyEvent: IStoryEvent) {
    if (storyEvent.rewardDesigns?.cloneTemplates) {
      storyEvent.rewardDesigns.cloneTemplates.forEach((cloneTemplate) => {
        this._unlockState.items.cloneTemplates.unlockDesign(cloneTemplate, 0, true);
      });
    }
  }

  private processStoryEventSidejobs(storyEvent: IStoryEvent) {
    if (storyEvent.unlockActivities?.sidejobs) {
      storyEvent.unlockActivities.sidejobs.forEach((sidejob) => {
        this._unlockState.activities.sidejobs.unlockActivity(sidejob);
      });
    }
  }

  private processStoryEventContracts(storyEvent: IStoryEvent) {
    if (storyEvent.unlockActivities?.contracts) {
      storyEvent.unlockActivities.contracts.forEach((contract) => {
        this._unlockState.activities.contracts.unlockActivity(contract);
      });
    }
  }
}
