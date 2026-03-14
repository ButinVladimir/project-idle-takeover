import { BaseController } from '@shared/index';
import { IProgram, ProgramName, IProcess, ProcessValidationResult } from '@state/mainframe-state';

export class StartProcessDialogController extends BaseController {
  getAvailableRamForProgram(programName?: ProgramName): number {
    if (programName) {
      return this.mainframeState.processes.validator.calculateAvailableRamForProgram(programName);
    }

    return this.mainframeState.processes.availableRam;
  }

  listPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name)!;
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

  validateProcess(name: ProgramName, threads: number): boolean {
    return this.mainframeState.processes.validator.validateProcess(name, threads) === ProcessValidationResult.valid;
  }
}
