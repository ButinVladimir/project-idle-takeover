import { IProgram } from '@state/mainframe-state';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { TYPES } from '@state/types';
import { IProcess, type IProcessParameters, ISerializedProcess } from './interfaces';
import { type IMainframeState } from '../../interfaces';

const { lazyInject } = decorators;

export class Process implements IProcess {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  private _program: IProgram;
  private _isActive: boolean;
  private _threads: number;
  private _currentCompletionPoints: number;
  private _usedCores: number;

  constructor(parameters: IProcessParameters) {
    this._program = parameters.program;
    this._isActive = parameters.isActive;
    this._threads = parameters.threads;
    this._currentCompletionPoints = parameters.currentCompletionPoints;
    this._usedCores = 0;

    this._stateUiConnector.registerEventEmitter(this, ['_isActive', '_threads', '_usedCores']);
  }

  get program() {
    return this._program;
  }

  get isActive() {
    return this._isActive;
  }

  get threads() {
    return this._threads;
  }

  get currentCompletionPoints() {
    return this._currentCompletionPoints;
  }

  get maxCompletionPoints() {
    return this.program.completionPoints * this.threads;
  }

  get totalRam() {
    return this.program.isAutoscalable
      ? this._mainframeState.processes.availableRam + this.program.ram
      : this.program.ram * this.threads;
  }

  get usedCores() {
    return this._usedCores;
  }

  set usedCores(value: number) {
    this._usedCores = value;
  }

  get maxCores() {
    return this.threads * this.program.cores;
  }

  calculateCompletionDelta(passedTime: number): number {
    return this.program.calculateCompletionDelta(this.threads, this.usedCores, passedTime);
  }

  calculateCompletionTime(): number {
    return this.program.calculateCompletionTime(this.threads, this.usedCores);
  }

  toggleActive(active: boolean) {
    this._isActive = active;
    this._mainframeState.processes.requestUpdateRunningProcesses();
  }

  increaseCompletion(delta: number): void {
    this._currentCompletionPoints += delta;

    const maxCompletionPoints = this.maxCompletionPoints;

    if (this._currentCompletionPoints > maxCompletionPoints) {
      this._currentCompletionPoints = maxCompletionPoints;
    }
  }

  resetCompletion(): void {
    this._currentCompletionPoints = 0;
  }

  update(threads: number) {
    this._threads = threads;
    this.resetCompletion();
    this._mainframeState.processes.requestUpdateRunningProcesses();
    this.program.handlePerformanceUpdate();
  }

  serialize(): ISerializedProcess {
    return {
      programName: this.program.name,
      isActive: this.isActive,
      threads: this._threads,
      currentCompletionPoints: this.currentCompletionPoints,
    };
  }

  removeAllEventListeners() {
    this._stateUiConnector.unregisterEventEmitter(this);
  }
}
