import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListItemController extends BaseController {
  private _clone?: IClone;

  getCloneById(id: string): IClone | undefined {
    if (this._clone?.id !== id) {
      this._clone = this.clonesState.ownedClones.getCloneById(id);
    }

    return this._clone;
  }

  deleteCloneById(id: string) {
    this.clonesState.ownedClones.deleteClone(id);
  }
}
