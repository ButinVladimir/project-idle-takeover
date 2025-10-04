import { BaseController } from '@/shared';

export class ClonesListItemExperienceController extends BaseController {
  get developmentLevel() {
    return this.globalState.development.level;
  }

  getCloneExperienceGrowth(cloneId: string): number {
    return this.growthState.experience.getGrowthByClone(cloneId);
  }
}
