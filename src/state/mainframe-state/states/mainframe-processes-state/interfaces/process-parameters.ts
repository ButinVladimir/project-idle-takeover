import { IProgram } from '@state/mainframe-state/states/progam-factory/interfaces/program';

export interface IProcessParameters {
  program: IProgram;
  enabled: boolean;
  threads: number;
  currentCompletionPoints: number;
}
