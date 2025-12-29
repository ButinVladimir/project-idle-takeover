import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListItemController extends BaseController {
  getCloneById(id: string): IClone | undefined {
    return this.clonesState.ownedClones.getCloneById(id);
  }

  deleteCloneById(id: string) {
    this.clonesState.ownedClones.deleteClone(id);
  }
}
