import { StoryGoalState } from '../../types';
import { IStoryEvent } from './story-event';

export interface IStoryGoal extends IStoryEvent {
  state: StoryGoalState;
}
