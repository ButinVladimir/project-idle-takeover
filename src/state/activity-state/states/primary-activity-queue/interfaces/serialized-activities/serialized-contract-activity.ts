import { ISerializedPrimaryActivity } from '../serialized-primary-activity';

export interface ISerializedContractActivity extends ISerializedPrimaryActivity {
  contractAssignmentId: string;
  passedTime: number;
}
