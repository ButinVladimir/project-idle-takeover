import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListItemDescriptionController extends BaseController {
  getCloneSynchronization(clone: IClone): number {
    return this.clonesState.ownedClones.calculateCloneSynchronization(clone.templateName, clone.tier);
  }
}
