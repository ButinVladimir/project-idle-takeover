import { ISerializeable } from '@shared/interfaces/serializable';
import { IConnectivitySerializedState } from '../serialized-states';

export interface IConnectivityState extends ISerializeable<IConnectivitySerializedState> {
  pointsByProgram: number;
  increasePointsByProgram(pointsDelta: number): void;
}
