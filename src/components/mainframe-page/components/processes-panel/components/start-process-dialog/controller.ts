import { BaseController } from '@shared/index';
import { IProgram, ProgramName, IProcess, ProcessesBatchValidationResult } from '@state/mainframe-state';

export class StartProcessDialogController extends BaseController {
  get availableRam(): number {
    return this.mainframeState.processes.availableRam;
  }

  getAvailableRamForProgramsBatch(programNames: ProgramName[]): number {
    return this.mainframeState.processes.validator.calculateAvailableRamForPrograms(programNames);
  }

  listPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name)!;
  }

  getProcess(name: ProgramName): IProcess | undefined {
    return this.mainframeState.processes.getProcessByName(name);
  }

  getRunningScalableProgram(): IProcess | undefined {
    return this.mainframeState.processes.runningScalableProcess;
  }

  startProcesses(names: ProgramName[], threads: number): boolean {
    return this.mainframeState.processes.addProcessesBatch(names, threads);
  }

  validateProcesses(names: ProgramName[], threads: number): boolean {
    return (
      this.mainframeState.processes.validator.validateProcessesBatch(names, threads) ===
      ProcessesBatchValidationResult.valid
    );
  }
}
