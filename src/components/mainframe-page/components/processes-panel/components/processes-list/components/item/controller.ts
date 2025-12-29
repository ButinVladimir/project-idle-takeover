import { BaseController } from '@shared/index';
import { IProcess, ProgramName } from '@state/mainframe-state';

export class ProcessesListItemController extends BaseController {
  private _process?: IProcess;

  getProcess(programName: ProgramName) {
    if (this._process?.program.name !== programName) {
      this._process = this.mainframeState.processes.getProcessByName(programName);
    }

    return this._process;
  }

  toggleProcess(): void {
    this._process?.toggleEnabled(!this._process.enabled);
  }

  deleteProcessByName(programName: ProgramName): void {
    this.mainframeState.processes.deleteProcess(programName);
  }
}
