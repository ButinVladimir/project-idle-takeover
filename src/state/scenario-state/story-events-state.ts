import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { Faction, MapSpecialEvent, NotificationType } from '@shared/index';
import { STORY_MESSAGES } from '@texts/story';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { type IFactionState } from '@state/faction-state';
import { type ICityState } from '@state/city-state';
import { type IScenarioState, IStoryEvent, IStoryStateValues, IStoryEventsState, IStoryGoal } from './interfaces';
import { StoryGoalState } from './types';

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

  constructor() {
    this._districtsStateRecalculationRequested = false;

    this._stateUiConnector.registerEventEmitter(this, []);
  }

  visitEvents(prevStoryStateValues: Partial<IStoryStateValues>) {
    const completeStoryStateValues: IStoryStateValues = {
      level: this._globalState.development.level,
      capturedDistrictsCount: this._cityState.getCapturedDistrictsCount(),
      faction: this._factionState.currentFaction,
      ...prevStoryStateValues,
    };

    this.visitEventsImplementation(completeStoryStateValues);
  }

  listGoals(): IStoryGoal[] {
    const availableGoals: IStoryGoal[] = [];
    const storyEvents = this._scenarioState.currentValues.storyEvents;

    const currentState: IStoryStateValues = {
      level: this._globalState.development.level,
      faction: this._factionState.currentFaction,
      capturedDistrictsCount: this._cityState.getCapturedDistrictsCount(),
    };

    for (const storyEvent of storyEvents) {
      const state = this.getStoryGoalState(storyEvent, currentState);

      availableGoals.push({
        ...storyEvent,
        state,
      });
    }

    return availableGoals;
  }

  visitStartingEvents(): void {
    this.visitEvents({ level: -1, capturedDistrictsCount: -1, faction: Faction.neutral });
  }

  private visitEventsImplementation(prevState: IStoryStateValues) {
    this._districtsStateRecalculationRequested = false;
    const storyEvents = this._scenarioState.currentValues.storyEvents;

    const currentState: IStoryStateValues = {
      level: this._globalState.development.level,
      faction: this._factionState.currentFaction,
      capturedDistrictsCount: this._cityState.getCapturedDistrictsCount(),
    };

    for (const storyEvent of storyEvents) {
      const storyEventPrevState = this.getStoryGoalState(storyEvent, prevState);
      const storyEventCurrentState = this.getStoryGoalState(storyEvent, currentState);

      if (storyEventPrevState === StoryGoalState.passed || storyEventCurrentState !== StoryGoalState.passed) {
        continue;
      }

      this.visitSingleStoryEvent(storyEvent);
    }

    this.unlockDistricts();
  }

  private visitSingleStoryEvent(storyEvent: IStoryEvent) {
    if (storyEvent.messages) {
      storyEvent.messages.forEach((messageKey) => {
        this._notificationsState.pushNotification(NotificationType.storyEvent, STORY_MESSAGES[messageKey]());
      });
    }

    if (storyEvent.unlockFeatures) {
      storyEvent.unlockFeatures.forEach((feature) => {
        this._unlockState.features.unlockFeature(feature);
      });
    }

    if (storyEvent.specialEvents) {
      storyEvent.specialEvents.forEach(this.unlockSpecialEvent);
    }

    if (storyEvent.rewardDesigns?.programs) {
      storyEvent.rewardDesigns.programs.forEach((program) => {
        this._unlockState.items.programs.unlockDesign(program, 0, true);
      });
    }

    if (storyEvent.rewardDesigns?.cloneTemplates) {
      storyEvent.rewardDesigns.cloneTemplates.forEach((cloneTemplate) => {
        this._unlockState.items.cloneTemplates.unlockDesign(cloneTemplate, 0, true);
      });
    }

    if (storyEvent.unlockSidejobs) {
      storyEvent.unlockSidejobs.forEach((sidejob) => {
        this._unlockState.activities.sidejobs.unlockSidejob(sidejob);
      });
    }
  }

  private getStoryGoalState(storyEvent: IStoryEvent, currentStateValues: IStoryStateValues): StoryGoalState {
    const states = [
      this.getStoryGoalLevelState(storyEvent, currentStateValues),
      this.getStoryGoalFactionState(storyEvent, currentStateValues),
      this.getStoryGoalCapturedDistrictsCountState(storyEvent, currentStateValues),
    ];

    if (states.includes(StoryGoalState.notAvailable)) {
      return StoryGoalState.notAvailable;
    }

    if (states.includes(StoryGoalState.available)) {
      return StoryGoalState.available;
    }

    return StoryGoalState.passed;
  }

  private getStoryGoalLevelState(storyEvent: IStoryEvent, currentStateValues: IStoryStateValues): StoryGoalState {
    if (storyEvent.requirements.level !== undefined && storyEvent.requirements.level > currentStateValues.level) {
      return StoryGoalState.available;
    }

    return StoryGoalState.passed;
  }

  private getStoryGoalFactionState(storyEvent: IStoryEvent, currentStateValues: IStoryStateValues): StoryGoalState {
    if (
      storyEvent.requirements.faction === undefined ||
      storyEvent.requirements.faction === currentStateValues.faction
    ) {
      return StoryGoalState.passed;
    }

    if (currentStateValues.faction === Faction.neutral) {
      return StoryGoalState.available;
    }

    return StoryGoalState.notAvailable;
  }

  private getStoryGoalCapturedDistrictsCountState(
    storyEvent: IStoryEvent,
    currentStateValues: IStoryStateValues,
  ): StoryGoalState {
    if (
      storyEvent.requirements.capturedDistrictsCount !== undefined &&
      storyEvent.requirements.capturedDistrictsCount > currentStateValues.capturedDistrictsCount
    ) {
      return StoryGoalState.available;
    }

    return StoryGoalState.passed;
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
}
