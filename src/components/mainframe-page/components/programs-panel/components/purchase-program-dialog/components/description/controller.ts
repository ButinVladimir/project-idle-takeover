import { BaseController } from '@shared/base-controller';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';

export class ProgramDiffTextController extends BaseController {
  get money(): number {
    return this.globalState.money.money;
  }

  get ram(): number {
    return this.mainframeState.hardware.ram.totalLevel;
  }

  get cores(): number {
    return this.mainframeState.hardware.cores.totalLevel;
  }

  getProgramCost(programName: ProgramName, tier: number, level: number): number {
    return this.mainframeState.programs.calculateProgramCost(programName, tier, level);
  }
}
