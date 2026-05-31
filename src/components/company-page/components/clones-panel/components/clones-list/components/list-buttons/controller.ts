import { BaseController } from '@shared/index';

export class ClonesListButtonsController extends BaseController {
  deleteDisplayedClones(ids: string[]) {
    this.clonesState.ownedClones.deleteClones(ids);
  }
}
