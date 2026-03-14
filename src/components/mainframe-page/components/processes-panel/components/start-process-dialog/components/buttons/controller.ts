import { BaseController } from '@shared/index';
import { IProcess, ProcessValidationResult, ProgramName } from '@state/mainframe-state';

export class StartProcessDialogButtonsController extends BaseController {
  getRunningScalableProgram(): IProcess | undefined {
    return this.mainframeState.processes.runningScalableProcess;
  }

  validateProcess(program: ProgramName, threads: number): ProcessValidationResult {
    return this.mainframeState.processes.validator.validateProcess(program, threads);
  }
}
