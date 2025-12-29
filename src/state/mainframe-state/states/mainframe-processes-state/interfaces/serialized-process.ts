import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';

export interface ISerializedProcess {
  programName: ProgramName;
  enabled: boolean;
  threads: number;
  currentCompletionPoints: number;
}
