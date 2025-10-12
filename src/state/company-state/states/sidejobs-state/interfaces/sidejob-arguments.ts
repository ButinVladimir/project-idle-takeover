import { IDistrictState } from '@state/city-state';
import { IClone } from '../../clone-factory';

export interface ISidejobArguments {
  id: string;
  sidejobName: string;
  district: IDistrictState;
  assignedClone?: IClone;
}
