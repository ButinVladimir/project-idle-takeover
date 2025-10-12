import { ISerializeable } from '@shared/index';
import { IAvailableSidejobsSerializedState } from './available-sidejobs-serialized-state';

export interface IAvailableSidejobsState extends ISerializeable<IAvailableSidejobsSerializedState> {
  listUnlockedSidejobs(): string[];
  isSidejobUnlocked(sidejob: string): boolean;
  unlockSidejob(sidejob: string): void;
  makeUnlockSidejobMessage(sidejob: string): string;
}
