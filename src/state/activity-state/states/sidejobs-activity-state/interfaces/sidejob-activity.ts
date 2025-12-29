import { DistrictTypeRewardParameter } from '@/shared';
import { ISidejob } from '../../sidejobs-factory';
import { ISerializedSidejobActivity } from './serialized-sidejob-activity';

export interface ISidejobActivity {
  id: string;
  enabled: boolean;
  active: boolean;
  sidejob: ISidejob;
  perform(): void;
  getParameterGrowth(parameter: DistrictTypeRewardParameter): number;
  toggleEnabled(enabled: boolean): void;
  serialize(): ISerializedSidejobActivity;
  removeAllEventListeners(): void;
}
