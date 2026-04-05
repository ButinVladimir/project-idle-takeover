import { BaseController } from '@shared/index';

export class ClonesListUpgradeButtonsController extends BaseController {
  deleteDisplayedClones(ids: string[]) {
    this.clonesState.ownedClones.deleteClones(ids);
  }
}
