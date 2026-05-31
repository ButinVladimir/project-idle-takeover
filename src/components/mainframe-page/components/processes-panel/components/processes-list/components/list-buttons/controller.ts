import { BaseController } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export class ProcessesListButtonsController extends BaseController {
  deleteProcesses(programNames: ProgramName[]) {
    this.mainframeState.processes.deleteProcesses(programNames);
  }
}
