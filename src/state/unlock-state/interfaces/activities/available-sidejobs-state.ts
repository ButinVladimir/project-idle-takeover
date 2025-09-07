import { ISerializeable } from '@shared/index';
import { SidejobName } from '@state/company-state';
import { IAvailableSidejobsSerializedState } from './available-sidejobs-serialized-state';

export interface IAvailableSidejobsState extends ISerializeable<IAvailableSidejobsSerializedState> {
  listUnlockedSidejobs(): SidejobName[];
  isSidejobUnlocked(sidejob: SidejobName): boolean;
  unlockSidejob(sidejob: SidejobName): void;
  makeUnlockSidejobMessage(sidejob: SidejobName): string;
}
