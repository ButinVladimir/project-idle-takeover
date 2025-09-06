import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { NotificationType } from '@shared/index';
import { STORY_MESSAGES } from '@texts/story';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type INotificationsState } from '@state/notifications-state';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { type IScenarioState, IStoryEventsState, IStoryGoal } from './interfaces';
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

  constructor() {
    this._stateUiConnector.registerEventEmitter(this, []);
  }

  visitEventsByLevel(prevLevel: number) {
    this.visitEvents(prevLevel);
  }

  listGoals(): IStoryGoal[] {
    const availableGoals: IStoryGoal[] = [];
    const storyEvents = this._scenarioState.currentValues.storyEvents;
    let state: StoryGoalState = StoryGoalState.passed;

    for (const storyEvent of storyEvents) {
      state = StoryGoalState.passed;

      if (storyEvent.level > this._globalState.development.level) {
        state = StoryGoalState.available;
      }

      availableGoals.push({
        ...storyEvent,
        state,
      });
    }

    return availableGoals;
  }

  visitStartingEvents(): void {
    this.visitEvents(-1);
  }

  private visitEvents(prevLevel: number) {
    const storyEvents = this._scenarioState.currentValues.storyEvents;

    for (const storyEvent of storyEvents) {
      if (storyEvent.level <= prevLevel) {
        continue;
      }

      if (storyEvent.level > this._globalState.development.level) {
        continue;
      }

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
    }
  }
}
