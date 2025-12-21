import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { ISerializeable } from '@shared/interfaces';
import { IProcess } from './process';
import { IMainframeProcessesSerializedState } from './mainframe-processes-serialized-state';

export interface IMainframeProcessesState extends ISerializeable<IMainframeProcessesSerializedState> {
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
  getAvailableRamForProgram(programName: ProgramName): number;
}
