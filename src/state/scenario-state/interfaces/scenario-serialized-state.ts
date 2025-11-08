import { IStoryEventsSerializedState } from './story-events';

export interface IScenarioSerializedState {
  currentScenario: string;
  storyEvents: IStoryEventsSerializedState;
}
