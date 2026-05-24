import { BaseController } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export class StartProcessDialogBatchDescriptionController extends BaseController {
  getAvailableRamForPrograms(programNames: ProgramName[]): number {
    return this.mainframeState.processes.validator.calculateAvailableRamForPrograms(programNames);
  }

  getRequiredRamForPrograms(programNames: ProgramName[], threads: number): number {
    return this.mainframeState.processes.validator.calculateRequiredRamForPrograms(programNames, threads);
  }
}
