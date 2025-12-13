import { IContractAssignment } from '@state/automation-state';
import { IPrimaryActivity } from '../primary-activity';
import { ISerializedContractActivity } from '../serialized-activities';

export interface IContractActivity extends IPrimaryActivity {
  type: 'contract';
  contractAssignment: IContractAssignment;
  passedTime: number;
  serialize(): ISerializedContractActivity;
}
