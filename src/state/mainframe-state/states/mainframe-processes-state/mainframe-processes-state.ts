import { inject, injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import type { IMessageLogState } from '@state/message-log-state/interfaces/message-log-state';
import type { ISettingsState } from '@state/settings-state/interfaces/settings-state';
import type { IFormatter } from '@shared/interfaces/formatter';
import { TYPES } from '@state/types';
import { ProgramsEvent } from '@shared/types';
import { moveElementInArray, removeElementsFromArray } from '@shared/helpers';
import { PROGRAM_TEXTS } from '@texts/programs';
import type { IMainframeState } from '../../interfaces/mainframe-state';
import { ProgramName } from '../progam-factory/types';
import {
  IMainframeProcessesSerializedState,
  IMainframeProcessesState,
  IProcess,
  type IProcessCompletionSpeedParameter,
  ISerializedProcess,
} from './interfaces';
import { Process } from './process';

const { lazyInject } = decorators;

@injectable()
export class MainframeProcessesState implements IMainframeProcessesState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  @inject(TYPES.ProcessCompletionSpeedParameter)
  private _processCompletionSpeed!: IProcessCompletionSpeedParameter;

  private _processesList: IProcess[];
  private _processesMap: Map<ProgramName, IProcess>;
  private _runningProcesses: IProcess[];
  private _availableCores: number;
  private _availableRam: number;
  private _runningScalableProcess?: IProcess;
  private _processUpdateRequested: boolean;
  private _performanceUpdateRequested: boolean;

  constructor() {
    this._processesMap = new Map<ProgramName, IProcess>();
    this._processesList = [];
    this._runningProcesses = [];
    this._availableCores = 0;
    this._availableRam = 0;
    this._processUpdateRequested = false;
    this._performanceUpdateRequested = false;

    this._stateUiConnector.registerEventEmitter(this, [
      '_availableCores',
      '_availableRam',
      '_runningScalableProcess',
      '_processesList',
    ]);
  }

  get availableCores() {
    return this._availableCores;
  }

  get availableRam() {
    return this._availableRam;
  }

  get runningScalableProcess() {
    return this._runningScalableProcess;
  }

  get processCompletionSpeed() {
    return this._processCompletionSpeed;
  }

  listProcesses(): IProcess[] {
    return this._processesList;
  }

  getProcessByName(programName: ProgramName): IProcess | undefined {
    return this._processesMap.get(programName);
  }

  addProcess(programName: ProgramName, threads: number): boolean {
    const program = this._mainframeState.programs.getOwnedProgramByName(programName);
    if (!program) {
      return false;
    }

    if (!program.isAutoscalable && threads <= 0) {
      throw new Error('Invalid amount of threads for process');
    }

    const threadCount = program.isAutoscalable ? 0 : threads;

    const existingProcess = this.getProcessByName(programName);
    const availableRam = this.getAvailableRamForProgram(programName);

    if (!program.isAutoscalable && availableRam < program.ram * threads) {
      return false;
    }

    if (program.isAutoscalable && availableRam === 0) {
      return false;
    }

    if (program.isAutoscalable && !existingProcess) {
      this.deleteAutoscalableProcesses();
    }

    if (existingProcess) {
      existingProcess.update(threads);
    } else {
      const process = this.createProcess({
        isActive: true,
        threads: threadCount,
        currentCompletionPoints: 0,
        programName: programName,
      });

      if (program.isAutoscalable) {
        this._processesList.unshift(process);
      } else {
        this._processesList.push(process);
      }

      this._processesMap.set(programName, process);
    }

    this.requestUpdateProcesses();

    const programTitle = PROGRAM_TEXTS[program.name].title();

    if (program.isAutoscalable) {
      this._messageLogState.postMessage(
        ProgramsEvent.processStarted,
        msg(str`Process for program "${programTitle}" has been started`),
      );
    } else {
      const formattedThreads = this._formatter.formatNumberDecimal(threadCount);

      this._messageLogState.postMessage(
        ProgramsEvent.processStarted,
        msg(str`Process for program "${programTitle}" with ${formattedThreads} threads has been started`),
      );
    }

    return true;
  }

  toggleAllProcesses(active: boolean): void {
    for (const process of this._processesList) {
      process.toggleActive(active);
    }

    this.requestUpdateProcesses();
  }

  deleteProcess(programName: ProgramName): void {
    const process: IProcess | undefined = this.getProcessByName(programName);
    const index = this._processesList.findIndex((process) => process.program.name === programName);

    if (index >= 0) {
      removeElementsFromArray(this._processesList, index, 1);
    }

    if (process) {
      process.usedCores = 0;
      process.removeAllEventListeners();

      this._processesMap.delete(programName);

      const programTitle = PROGRAM_TEXTS[programName].title();

      if (process.program.isAutoscalable) {
        this._messageLogState.postMessage(
          ProgramsEvent.processStarted,
          msg(str`Process for program "${programTitle}" has been deleted`),
        );
      } else {
        const formattedThreads = this._formatter.formatNumberDecimal(process.threads);

        this._messageLogState.postMessage(
          ProgramsEvent.processStarted,
          msg(str`Process for program "${programTitle}" with ${formattedThreads} threads has been deleted`),
        );
      }
    }

    this.requestUpdateProcesses();
  }

  deleteAllProcesses() {
    this.clearState();

    this._messageLogState.postMessage(ProgramsEvent.allProcessesDeleted, msg('All process have been deleted'));

    this.requestUpdateProcesses();
  }

  requestUpdateProcesses() {
    this._processUpdateRequested = true;
  }

  requestUpdatePerformance() {
    this._processCompletionSpeed.requestMultipliersRecalculation();
    this._performanceUpdateRequested = true;
  }

  processTick() {
    if (this._processUpdateRequested) {
      this.updateRunningProcesses();
    }

    if (this._performanceUpdateRequested) {
      this.updatePerformance();
    }

    this._processCompletionSpeed.recalculateMultipliers();

    if (this._runningScalableProcess?.isActive) {
      this._runningScalableProcess.program.perform(
        this._runningScalableProcess.usedCores,
        this._runningScalableProcess.totalRam,
      );
    }

    let hasFinishedProcesses = false;

    for (const process of this._runningProcesses) {
      process.increaseCompletion(process.calculateCompletionDelta(this._settingsState.updateInterval));

      if (process.currentCompletionPoints >= process.maxCompletionPoints) {
        process.program.perform(process.threads, process.totalRam);
        hasFinishedProcesses = true;
      }
    }

    if (hasFinishedProcesses) {
      this.updateFinishedProcesses();
      this.requestUpdateProcesses();
    }
  }

  moveProcess(programName: ProgramName, newPosition: number) {
    const oldPosition = this._processesList.findIndex((process) => process.program.name === programName);

    if (oldPosition === -1) {
      return;
    }

    moveElementInArray(this._processesList, oldPosition, newPosition);

    this.requestUpdateProcesses();
  }

  getAvailableRamForProgram(programName: ProgramName): number {
    const program = this._mainframeState.programs.getOwnedProgramByName(programName);
    if (!program) {
      return 0;
    }

    let result = this.availableRam;

    if (program.isAutoscalable && this._runningScalableProcess) {
      result += program.ram;
    }

    if (!program.isAutoscalable) {
      const existingProcess = this.getProcessByName(programName);

      if (existingProcess) {
        result += existingProcess.totalRam;
      }
    }

    return result;
  }

  async startNewState(): Promise<void> {
    this.clearState();

    this.requestUpdateProcesses();
    this.requestUpdatePerformance();
  }

  async deserialize(serializedState: IMainframeProcessesSerializedState): Promise<void> {
    this.clearState();

    serializedState.processes.forEach((serializedProcess) => {
      const process = this.createProcess(serializedProcess);
      this._processesMap.set(serializedProcess.programName, process);
      this._processesList.push(process);
    });

    this.requestUpdateProcesses();
    this.requestUpdatePerformance();
  }

  serialize(): IMainframeProcessesSerializedState {
    return {
      processes: this._processesList.map(this.serializeProcess),
    };
  }

  private serializeProcess = (process: IProcess): ISerializedProcess => {
    return process.serialize();
  };

  private updateRunningProcesses = () => {
    this._processUpdateRequested = false;

    let availableCores = this._mainframeState.hardware.cores.totalLevel;
    let availableRam = this._mainframeState.hardware.ram.totalLevel;
    this._runningProcesses.length = 0;
    this._runningScalableProcess = this._processesList.find((process) => process.program.isAutoscalable);
    let runningScalableProcessCores = 0;

    if (this._runningScalableProcess) {
      availableRam--;
    }

    if (availableCores > 0 && this._runningScalableProcess?.isActive) {
      availableCores--;
      runningScalableProcessCores++;
    }

    let processRam = 0;
    let usedCores = 0;

    for (const process of this._processesList) {
      if (process.program.isAutoscalable) {
        continue;
      }

      processRam = process.totalRam;
      availableRam -= processRam;

      if (!process.isActive) {
        usedCores = 0;
      } else {
        usedCores = Math.min(process.maxCores, availableCores);
      }

      if (usedCores > 0) {
        process.usedCores = usedCores;
        this._runningProcesses.push(process);
        availableCores -= usedCores;
      } else {
        process.usedCores = 0;
      }
    }

    if (this._runningScalableProcess?.isActive) {
      runningScalableProcessCores += availableCores;
    }

    if (this._runningScalableProcess) {
      this._runningScalableProcess.usedCores = runningScalableProcessCores;
    }

    this._availableRam = availableRam;
    this._availableCores = availableCores;
  };

  private updateFinishedProcesses(): void {
    let index = 0;

    while (index < this._processesList.length) {
      const process = this._processesList[index];

      if (!process.program.isAutoscalable && process.currentCompletionPoints >= process.maxCompletionPoints) {
        removeElementsFromArray(this._processesList, index, 1);
        process.resetCompletion();
        this._processesList.push(process);
      } else {
        index++;
      }
    }
  }

  private createProcess = (processParameters: ISerializedProcess): IProcess => {
    const process = new Process({
      isActive: processParameters.isActive,
      threads: processParameters.threads,
      program: this._mainframeState.programs.getOwnedProgramByName(processParameters.programName)!,
      currentCompletionPoints: processParameters.currentCompletionPoints,
    });

    return process;
  };

  private deleteAutoscalableProcesses(): void {
    const scalableProgram = this._runningScalableProcess;

    this._runningScalableProcess = undefined;

    if (scalableProgram) {
      this.deleteProcess(scalableProgram.program.name);
    }
  }

  private clearState() {
    for (const process of this._processesList) {
      process.usedCores = 0;
      process.removeAllEventListeners();
    }

    this._processesList.length = 0;
    this._processesMap.clear();
  }

  private updatePerformance() {
    this._performanceUpdateRequested = false;

    for (const process of this._processesList) {
      process.program.handlePerformanceUpdate();
    }
  }
}
