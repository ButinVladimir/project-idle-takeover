import { ProgramName } from '@state/mainframe-state';
import { ISerializeable } from '@shared/index';
import { IProcess } from './process';
import { IMainframeProcessesSerializedState } from './mainframe-processes-serialized-state';
import { IMainframeProcessesValidator } from './mainframe-processes-validator';

export interface IMainframeProcessesState extends ISerializeable<IMainframeProcessesSerializedState> {
  validator: IMainframeProcessesValidator;
  availableCores: number;
  availableRam: number;
  runningScalableProcess: IProcess | undefined;
  listProcesses(): IProcess[];
  getProcessByName(programName: ProgramName): IProcess | undefined;
  addProcessesBatch(programNames: ProgramName[], threads: number): boolean;
  deleteProcess(programName: ProgramName): void;
  deleteProcesses(programName: ProgramName[]): void;
  requestUpdateRunningProcesses(): void;
  recalculateRam(): void;
  processTick(): void;
  moveProcess(programName: ProgramName, newPosition: number): void;
}
