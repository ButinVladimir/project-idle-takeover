import { BaseController } from '@shared/index';
import { IProgram, IProcess, ProgramName } from '@state/mainframe-state';

export class ProcessDiffTextController extends BaseController {
  private _program?: IProgram;

  get maxRam(): number {
    return this.mainframeState.hardware.ram.totalLevel;
  }

  get maxCores(): number {
    return this.mainframeState.hardware.cores.totalLevel;
  }

  getProgram(name: ProgramName): IProgram | undefined {
    this._program = this.mainframeState.programs.getOwnedProgramByName(name)!;

    return this._program;
  }

  getProcessByName(name: ProgramName): IProcess | undefined {
    return this.mainframeState.processes.getProcessByName(name);
  }
}
