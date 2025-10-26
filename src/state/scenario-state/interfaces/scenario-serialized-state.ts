import { Scenario } from '@shared/index';
import { IStoryEventsSerializedState } from './story-events';

export interface IScenarioSerializedState {
  currentScenario: Scenario;
  storyEvents: IStoryEventsSerializedState;
}
