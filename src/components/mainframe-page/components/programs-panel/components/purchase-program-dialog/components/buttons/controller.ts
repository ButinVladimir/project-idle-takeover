import { BaseController } from '@shared/index';
import { IProgram, ProgramName, ProgramsBatchValidationResult } from '@state/mainframe-state';

export class PurchaseProgramDialogButtonsController extends BaseController {
  get money(): number {
    return this.globalState.money.money;
  }

  get moneyGrowth(): number {
    return this.growthState.money.totalGrowth;
  }

  getOwnedProgram(programName: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(programName);
  }

  getProgramCost(programName: ProgramName, tier: number, level: number): number {
    return this.mainframeState.programs.validator.calculateProgramCost(programName, tier, level);
  }

  validateProgramsBatch(programNames: ProgramName[], tier: number, level: number): ProgramsBatchValidationResult {
    return this.mainframeState.programs.validator.validateProgramsBatch(programNames, tier, level);
  }
}
