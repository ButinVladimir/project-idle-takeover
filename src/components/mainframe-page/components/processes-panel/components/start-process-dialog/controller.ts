import { BaseController } from '@shared/index';
import { IProgram, ProgramName, IProcess } from '@state/mainframe-state';

export class StartProcessDialogController extends BaseController {
  private _program?: IProgram;

  getAvailableRamForProgram(programName?: ProgramName): number {
    if (programName) {
      return this.mainframeState.processes.getAvailableRamForProgram(programName);
    }

    return this.mainframeState.processes.availableRam;
  }

  listPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  getProgram(name: ProgramName): IProgram | undefined {
    this._program = this.mainframeState.programs.getOwnedProgramByName(name)!;

    return this._program;
  }

  getRunningScalableProgram(): IProcess | undefined {
    return this.mainframeState.processes.runningScalableProcess;
  }

  getProcessByName(name: ProgramName): IProcess | undefined {
    return this.mainframeState.processes.getProcessByName(name);
  }

  startProcess(name: ProgramName, threads: number): boolean {
    return this.mainframeState.processes.addProcess(name, threads);
  }
}
