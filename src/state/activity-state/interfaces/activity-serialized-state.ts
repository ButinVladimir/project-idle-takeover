import { ISerializedPrimaryActivityQueue, ISidejobsActivitySerializedState } from '../states';

export interface IActivitySerializedState {
  sidejobs: ISidejobsActivitySerializedState;
  primaryActivityQueue: ISerializedPrimaryActivityQueue;
}
