import { ISerializeable, Scenario } from '@shared/index';
import { IScenarioSerializedState } from './scenario-serialized-state';
import { IScenarioValues } from './scenario-values';
import { IStoryEventsState } from './story-events';

export interface IScenarioState extends ISerializeable<IScenarioSerializedState> {
  currentScenario: Scenario;
  currentValues: IScenarioValues;
  storyEvents: IStoryEventsState;
  getScenarioValues(scenario: Scenario): IScenarioValues;
}
