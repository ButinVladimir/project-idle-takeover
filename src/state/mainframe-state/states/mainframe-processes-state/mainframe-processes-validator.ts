import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { IMainframeProcessesValidator } from './interfaces';
import { ProgramName } from '../progam-factory';
import { ProcessValidationResult } from './types';
import type { IMainframeState } from '../../interfaces/mainframe-state';

const { lazyInject } = decorators;

@injectable()
export class MainframeProcessesValidator implements IMainframeProcessesValidator {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  calculateAvailableRamForProgram(programName: ProgramName): number {
    const program = this._mainframeState.programs.getOwnedProgramByName(programName);
    if (!program) {
      return 0;
    }

    let result = this._mainframeState.processes.availableRam;

    const runningScalableProcess = this._mainframeState.processes.runningScalableProcess;
    if (program.isAutoscalable && runningScalableProcess) {
      result += runningScalableProcess.program.ram;
    }

    if (!program.isAutoscalable) {
      const existingProcess = this._mainframeState.processes.getProcessByName(programName);

      if (existingProcess) {
        result += existingProcess.usedRam;
      }
    }

    return result;
  }

  validateProcess(programName: ProgramName, threads: number): ProcessValidationResult {
    if (Number.isNaN(threads)) {
      return ProcessValidationResult.threadsInvalid;
    }

    const program = this._mainframeState.programs.getOwnedProgramByName(programName);
    if (!program) {
      return ProcessValidationResult.programNotOwned;
    }

    if (!program.isAutoscalable && threads <= 0) {
      return ProcessValidationResult.threadsInvalid;
    }

    const availableRam = this.calculateAvailableRamForProgram(programName);

    if (!program.isAutoscalable && availableRam < program.ram * threads) {
      return ProcessValidationResult.notEnoughRam;
    }

    if (program.isAutoscalable && availableRam < program.ram) {
      return ProcessValidationResult.notEnoughRam;
    }

    return ProcessValidationResult.valid;
  }
}
