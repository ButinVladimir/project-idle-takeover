import { ISerializeable } from '@shared/interfaces/serializable';
import { IMultiplierSerializedState } from '../serialized-states/multiplier-serialized-state';

export interface IRewardsState extends ISerializeable<IMultiplierSerializedState> {
  pointsByProgram: number;
  multiplierByProgram: number;
  increasePointsByProgram(pointsDelta: number): void;
  recalculateMultiplier(): void;
}
