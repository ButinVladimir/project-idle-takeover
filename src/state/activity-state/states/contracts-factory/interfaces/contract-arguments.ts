import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';

export interface IContractArguments {
  contractName: string;
  district: IDistrictState;
  assignedClones: IClone[];
}
