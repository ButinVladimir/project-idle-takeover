import { BaseController } from '@shared/index';
import { IProgram, ProgramName } from '@state/mainframe-state';

export class OwnedProgramsListItemController extends BaseController {
  private _ownedProgram?: IProgram;

  getProgram(programName: ProgramName) {
    if (this._ownedProgram?.name !== programName) {
      this._ownedProgram = this.mainframeState.programs.getOwnedProgramByName(programName);
    }

    return this._ownedProgram;
  }
}
