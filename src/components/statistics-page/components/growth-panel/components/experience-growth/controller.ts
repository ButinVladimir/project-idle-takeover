import { BaseController } from '@shared/index';
import { IClone } from '@state/clones-state';

export class StatisticsExperienceGrowthController extends BaseController {
  listClones(): IClone[] {
    return this.clonesState.ownedClones.listClones();
  }

  getGrowthByClone(cloneId: string): number {
    return this.growthState.experience.getGrowthByClone(cloneId);
  }
}
