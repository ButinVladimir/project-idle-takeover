import { ISerializeable } from '@shared/index';
import { IActivitySerializedState } from './activity-serialized-state';
import {
  IContractActivityValidator,
  IContractsFactory,
  ISidejobActivityValidator,
  ISidejobsActivityState,
  ISidejobsFactory,
} from '../states';

export interface IActivityState extends ISerializeable<IActivitySerializedState> {
  sidejobsActivity: ISidejobsActivityState;
  sidejobsFactory: ISidejobsFactory;
  sidejobActivityValidator: ISidejobActivityValidator;
  contractsFactory: IContractsFactory;
  contractActivityValidator: IContractActivityValidator;
  requestReassignment(): void;
  processTick(): void;
}
