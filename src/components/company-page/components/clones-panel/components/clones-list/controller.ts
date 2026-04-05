import { IClone } from '@state/clones-state';
import { BaseController } from '@shared/index';

export class ClonesListController extends BaseController {
  get developmentLevel() {
    return this.globalState.development.level;
  }

  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  moveClone(cloneId: string, newPosition: number) {
    this.clonesState.ownedClones.moveClone(cloneId, newPosition);
    this.host.requestUpdate();
  }

  getCloneTempateHighestTier(cloneTemplate: string): number {
    return this.unlockState.items.cloneTemplates.getItemHighestAvailableTier(cloneTemplate);
  }
}
