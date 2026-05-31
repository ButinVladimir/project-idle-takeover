import { BaseController } from '@shared/index';
import { IProcess, ProcessesBatchValidationResult, ProgramName } from '@state/mainframe-state';

export class StartProcessDialogButtonsController extends BaseController {
  validateProcessesBatch(programs: ProgramName[], threads: number): ProcessesBatchValidationResult {
    return this.mainframeState.processes.validator.validateProcessesBatch(programs, threads);
  }

  getProcess(programName: ProgramName): IProcess | undefined {
    return this.mainframeState.processes.getProcessByName(programName);
  }
}
