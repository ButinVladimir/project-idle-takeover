import { ISidejob } from '../../sidejobs-factory';
import { ISerializedSidejobActivity } from './serialized-sidejob-activity';

export interface ISidejobActivity {
  id: string;
  active: boolean;
  sidejob: ISidejob;
  perform(): void;
  serialize(): ISerializedSidejobActivity;
  removeAllEventListeners(): void;
}
