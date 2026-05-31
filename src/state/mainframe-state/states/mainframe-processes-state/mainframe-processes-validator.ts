import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { IMainframeProcessesValidator } from './interfaces';
import { ProgramName } from '../progam-factory';
import { ProcessesBatchValidationResult, ProcessValidationResult } from './types';
import type { IMainframeState } from '../../interfaces/mainframe-state';

const { lazyInject } = decorators;

@injectable()
export class MainframeProcessesValidator implements IMainframeProcessesValidator {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  calculateRequiredRamForPrograms(programNames: ProgramName[], threads: number) {
    let result = 0;

    for (const programName of programNames) {
      const program = this._mainframeState.programs.getOwnedProgramByName(programName);

      if (!program) {
        continue;
      }

      if (program.isAutoscalable) {
        result += program.ram;
      } else {
        result += program.ram * threads;
      }
    }

    return result;
  }

  calculateAvailableRamForPrograms(programNames: ProgramName[]): number {
    let result = this._mainframeState.processes.availableRam;
    let includesScalableProcess = false;

    for (const programName of programNames) {
      const program = this._mainframeState.programs.getOwnedProgramByName(programName);
      if (!program) {
        continue;
      }

      if (program.isAutoscalable) {
        includesScalableProcess = true;
      } else {
        const existingProcess = this._mainframeState.processes.getProcessByName(programName);

        if (existingProcess) {
          result += existingProcess.usedRam;
        }
      }
    }

    if (includesScalableProcess) {
      const runningScalableProcess = this._mainframeState.processes.runningScalableProcess;

      if (runningScalableProcess) {
        result += runningScalableProcess.program.ram;
      }
    }

    return result;
  }

  validateProcess(programName: ProgramName, threads: number): ProcessValidationResult {
    if (Number.isNaN(threads) || threads <= 0) {
      return ProcessValidationResult.threadsInvalid;
    }

    const program = this._mainframeState.programs.getOwnedProgramByName(programName);
    if (!program) {
      return ProcessValidationResult.programNotOwned;
    }

    return ProcessValidationResult.valid;
  }

  validateProcessesBatch(programNames: ProgramName[], threads: number): ProcessesBatchValidationResult {
    if (Number.isNaN(threads) || threads <= 0) {
      return ProcessesBatchValidationResult.threadsInvalid;
    }

    const validationResults = programNames.map((programName) => this.validateProcess(programName, threads));
    if (validationResults.includes(ProcessValidationResult.programNotOwned)) {
      return ProcessesBatchValidationResult.programsNotOwned;
    }

    const autoscalableProcesses = programNames.reduce(
      (sum, programName) =>
        this._mainframeState.programs.getOwnedProgramByName(programName)!.isAutoscalable ? sum + 1 : sum,
      0,
    );
    if (autoscalableProcesses > 1) {
      return ProcessesBatchValidationResult.multipleScalableProcesses;
    }

    const availableRam = this.calculateAvailableRamForPrograms(programNames);
    const requiredRam = this.calculateRequiredRamForPrograms(programNames, threads);
    if (requiredRam > availableRam) {
      return ProcessesBatchValidationResult.notEnoughRam;
    }

    return ProcessesBatchValidationResult.valid;
  }
}
