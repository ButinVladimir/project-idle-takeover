import { BaseController } from '@shared/index';
import { IProcess, IProgram, ProcessValidationResult, ProgramName } from '@state/mainframe-state';

export class StartProcessDialogBatchItemController extends BaseController {
  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name);
  }

  validateProcess(name: ProgramName, threads: number): ProcessValidationResult {
    return this.mainframeState.processes.validator.validateProcess(name, threads);
  }

  getProcessByName(name: ProgramName): IProcess | undefined {
    return this.mainframeState.processes.getProcessByName(name);
  }

  getRunningAutoscalableProcess(): IProcess | undefined {
    return this.mainframeState.processes.runningScalableProcess;
  }
}
