import { IProgram } from '@state/mainframe-state/states/progam-factory/interfaces/program';
import { ISerializedProcess } from './serialized-process';

export interface IProcess {
  program: IProgram;
  enabled: boolean;
  threads: number;
  usedCores: number;
  maxCores: number;
  currentCompletionPoints: number;
  maxCompletionPoints: number;
  totalRam: number;
  calculateCompletionDelta(passedTime: number): number;
  calculateCompletionTime(): number;
  toggleEnabled(active: boolean): void;
  increaseCompletion(delta: number): void;
  resetCompletion(): void;
  update(threads: number): void;
  serialize(): ISerializedProcess;
  removeAllEventListeners(): void;
}
