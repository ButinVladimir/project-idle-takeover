import { BaseController } from '@shared/index';
import { IClone } from '@state/clones-state';

export class StatisticsExperienceIncomeController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  getExperienceByClone(cloneId: string): number {
    return this.clonesState.ownedClones.getCloneById(cloneId)?.experience ?? 0;
  }
}
