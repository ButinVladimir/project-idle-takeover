import { BaseController } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export class OwnedProgramsFilterController extends BaseController {
  listAvailablePrograms(): ProgramName[] {
    return this.unlockState.items.programs.listAvailableItems();
  }

  getProgramMaxTier(programName: ProgramName): number {
    return this.unlockState.items.programs.getItemHighestAvailableTier(programName);
  }
}
