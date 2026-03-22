import { BaseController } from '@shared/index';
import { IProgram, ProgramName } from '@state/mainframe-state';

export class OwnedProgramsListController extends BaseController {
  get developmentLevel() {
    return this.globalState.development.level;
  }

  listOwnedPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  moveProgram(programName: ProgramName, newPosition: number) {
    this.mainframeState.programs.moveProgram(programName, newPosition);
    this.host.requestUpdate();
  }

  getProgramHighestTier(programName: ProgramName): number {
    return this.unlockState.items.programs.getDesignTier(programName);
  }
}
