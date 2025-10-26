import { ISerializeable } from '@shared/index';
import { IStoryGoal } from './story-goal';
import { IStoryEventsSerializedState } from './story-events-serialized-state';

export interface IStoryEventsState extends ISerializeable<IStoryEventsSerializedState> {
  visitEvents(): void;
  listGoals(): IStoryGoal[];
  isEventUnlocked(storyEventName: string): boolean;
}
