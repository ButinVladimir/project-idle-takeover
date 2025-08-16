import { BaseController } from '@shared/base-controller';
import { IProgram } from '@state/mainframe-state/states/progam-factory/interfaces/program';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';

export class OwnedProgramsListController extends BaseController {
  listOwnedPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }

  moveProgram(programName: ProgramName, newPosition: number) {
    this.mainframeState.programs.moveProgram(programName, newPosition);
    this.host.requestUpdate();
  }

  upgradeMaxAllPrograms() {
    this.mainframeState.programs.upgrader.upgradeMaxAllPrograms();
  }
}
