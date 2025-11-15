import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';

export interface ISidejobArguments {
  id: string;
  sidejobName: string;
  district: IDistrictState;
  assignedClone?: IClone;
}
