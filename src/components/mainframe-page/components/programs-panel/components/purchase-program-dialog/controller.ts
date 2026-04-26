import { BaseController } from '@shared/index';
import { IProgram, ProgramName, ProgramsBatchValidationResult } from '@state/mainframe-state';

export class PurchaseProgramDialogController extends BaseController {
  get developmentLevel(): number {
    return this.globalState.development.level;
  }

  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name);
  }

  getHighestAvailableTier(programNames: ProgramName[]): number {
    return programNames.reduce(
      (max, programName) => Math.max(max, this.unlockState.items.programs.getItemHighestAvailableTier(programName)),
      0,
    );
  }

  listAvailablePrograms(): ProgramName[] {
    return this.unlockState.items.programs.listAvailableItems();
  }

  validateProgramsBatch(names: ProgramName[], tier: number, level: number): boolean {
    return (
      this.mainframeState.programs.validator.validateProgramsBatch(names, tier, level) ===
      ProgramsBatchValidationResult.valid
    );
  }

  purchaseProgramsBatch(names: ProgramName[], tier: number, level: number): boolean {
    return this.mainframeState.programs.purchaseProgramsBatch(names, tier, level);
  }
}
