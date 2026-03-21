import { BaseController } from '@shared/index';
import { IProgram } from '@state/mainframe-state';

export class OwnedProgramsFilterController extends BaseController {
  listOwnedPrograms(): IProgram[] {
    return this.mainframeState.programs.listOwnedPrograms();
  }
}
