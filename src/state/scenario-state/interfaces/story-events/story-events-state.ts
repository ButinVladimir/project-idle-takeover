import { IStoryGoal } from './story-goal';

export interface IStoryEventsState {
  visitEventsByLevel(prevLevel: number): void;
  listGoals(): IStoryGoal[];
  visitStartingEvents(): void;
}
