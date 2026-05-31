import { BaseController } from '@shared/index';
import { IProgram, ProgramName, ProgramValidationResult } from '@state/mainframe-state';

export class PurchaseProgramDialogBatchItemController extends BaseController {
  get developmentLevel(): number {
    return this.globalState.development.level;
  }

  makeProgram(name: ProgramName, tier: number, level: number): IProgram {
    return this.mainframeState.programFactory.makeProgram({
      name: name,
      level: level,
      tier: tier,
      autoUpgradeEnabled: true,
    });
  }

  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name);
  }

  validateProgram(name: ProgramName, tier: number, level: number): ProgramValidationResult {
    return this.mainframeState.programs.validator.validateProgram(name, tier, level);
  }
}
