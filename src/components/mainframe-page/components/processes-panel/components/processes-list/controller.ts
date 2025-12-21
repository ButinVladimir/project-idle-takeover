import { BaseController } from '@shared/index';
import { IProcess, ProgramName } from '@state/mainframe-state';

export class ProcessesListController extends BaseController {
  listProcesses(): IProcess[] {
    return this.mainframeState.processes.listProcesses();
  }

  toggleAllProcesses(active: boolean) {
    this.mainframeState.processes.toggleAllProcesses(active);
  }

  deleteAllProcesses() {
    this.mainframeState.processes.deleteAllProcesses();
  }

  moveProcess(programName: ProgramName, newPosition: number) {
    this.mainframeState.processes.moveProcess(programName, newPosition);
    this.host.requestUpdate();
  }
}
