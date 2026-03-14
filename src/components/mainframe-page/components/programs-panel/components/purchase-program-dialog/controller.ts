import { BaseController } from '@shared/index';
import { IProgram, ProgramName, ProgramValidationResult } from '@state/mainframe-state';
import { IProgramParameters } from './types';

export class PurchaseProgramDialogController extends BaseController {
  get developmentLevel(): number {
    return this.globalState.development.level;
  }

  get money(): number {
    return this.globalState.money.money;
  }

  get moneyGrowth(): number {
    return this.growthState.money.totalGrowth;
  }

  makeProgram(parameters: IProgramParameters): IProgram {
    return this.mainframeState.programFactory.makeProgram({
      name: parameters.name,
      level: parameters.level,
      tier: parameters.tier,
      autoUpgradeEnabled: true,
    });
  }

  getOwnedProgram(name: ProgramName): IProgram | undefined {
    return this.mainframeState.programs.getOwnedProgramByName(name);
  }

  getHighestAvailableTier(programName: ProgramName): number {
    return this.unlockState.items.programs.getItemHighestAvailableTier(programName);
  }

  listAvailablePrograms(): ProgramName[] {
    return this.unlockState.items.programs.listAvailableItems();
  }

  validateProgram(name: ProgramName, tier: number, level: number): boolean {
    return this.mainframeState.programs.validator.validateProgram(name, tier, level) === ProgramValidationResult.valid;
  }

  purchaseProgram(name: ProgramName, tier: number, level: number): boolean {
    return this.mainframeState.programs.purchaseProgram(name, tier, level);
  }
}
