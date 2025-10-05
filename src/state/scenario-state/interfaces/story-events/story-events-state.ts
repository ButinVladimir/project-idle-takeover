import { IStoryGoal } from './story-goal';
import { IStoryStateValues } from './story-state-values';

export interface IStoryEventsState {
  visitEvents(prevStoryStateValues: Partial<IStoryStateValues>): void;
  listGoals(): IStoryGoal[];
  visitStartingEvents(): void;
}
