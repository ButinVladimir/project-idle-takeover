import { ICompanySidejobsSerializedState, ICompanyClonesSerializedState } from '../states';

export interface ICompanySerializedState {
  clones: ICompanyClonesSerializedState;
  sidejobs: ICompanySidejobsSerializedState;
}
