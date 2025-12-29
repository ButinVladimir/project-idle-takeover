import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class RenameCloneDialogController extends BaseController {
  private _clone?: IClone;

  getCloneById(id: string): IClone | undefined {
    if (this._clone?.id !== id) {
      this._clone = this.clonesState.ownedClones.getCloneById(id);
    }

    return this._clone;
  }

  renameCloneById(id: string, newName: string) {
    const clone = this.clonesState.ownedClones.getCloneById(id);

    if (clone) {
      clone.name = newName;
    }
  }

  generateName(): string {
    return this.clonesState.ownedClones.generateCloneName();
  }
}
