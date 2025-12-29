import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  toggleAutoupgrade(active: boolean) {
    this.clonesState.ownedClones.toggleAllClonesAutoupgrade(active);
  }

  moveClone(cloneId: string, newPosition: number) {
    this.clonesState.ownedClones.moveClone(cloneId, newPosition);
    this.host.requestUpdate();
  }

  deleteAllClones() {
    this.clonesState.ownedClones.deleteAllClones();
  }
}
