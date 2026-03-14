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
  addProcess(programName: ProgramName, threads: number): boolean;
  toggleAllProcesses(active: boolean): void;
  deleteProcess(programName: ProgramName): void;
  deleteAllProcesses(): void;
  requestUpdateRunningProcesses(): void;
  recalculateRam(): void;
  processTick(): void;
  moveProcess(programName: ProgramName, newPosition: number): void;
}
