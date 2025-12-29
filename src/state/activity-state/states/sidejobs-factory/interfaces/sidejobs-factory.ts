import { ISerializedSidejob } from './serialized-sidejob';
import { ISidejob } from './sidejob';

export interface ISidejobsFactory {
  makeSidejob(sidejobArgs: ISerializedSidejob): ISidejob;
}
