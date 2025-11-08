import { ISerializeable } from '@shared/index';
import { IScenarioSerializedState } from './scenario-serialized-state';
import { IScenarioValues } from './scenario-values';
import { IStoryEventsState } from './story-events';

export interface IScenarioState extends ISerializeable<IScenarioSerializedState> {
  currentScenario: string;
  currentValues: IScenarioValues;
  storyEvents: IStoryEventsState;
  getScenarioValues(scenario: string): IScenarioValues;
}
