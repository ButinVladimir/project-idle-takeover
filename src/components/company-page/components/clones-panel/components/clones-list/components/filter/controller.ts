import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesFilterController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }
}
