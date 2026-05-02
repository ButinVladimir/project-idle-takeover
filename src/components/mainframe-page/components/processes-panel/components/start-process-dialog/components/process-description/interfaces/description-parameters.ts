import { IProgram } from '@state/mainframe-state';
import { IFormatter } from '@shared/index';

export interface IDescriptionParameters {
  formatter: IFormatter;
  maxCores: number;
  maxRam: number;
  program: IProgram;
  threads: number;
  currentThreads: number;
}
