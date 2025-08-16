import { ISerializeable } from '@shared/interfaces/serializable';
import { ICompanySerializedState } from './company-serialized-state';
import { ICloneFactory, ICompanyClonesState, ICompanySidejobsState } from '../states';

export interface ICompanyState extends ISerializeable<ICompanySerializedState> {
  cloneFactory: ICloneFactory;
  clones: ICompanyClonesState;
  sidejobs: ICompanySidejobsState;
  requestReassignment(): void;
  processTick(): void;
}
