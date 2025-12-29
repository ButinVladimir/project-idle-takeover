import { BaseController } from '@shared/index';

export class OverviewDevelopmentLevelProgressController extends BaseController {
  getPrevDevelopmentLevelPoints() {
    return this.globalState.development.getLevelRequirements(this.globalState.development.level - 1);
  }

  getCurrentDevelopmentPoints() {
    return this.globalState.development.points;
  }

  getNextDevelopmentLevelPoints() {
    return this.globalState.development.getLevelRequirements(this.globalState.development.level);
  }

  getDevelopmentGrowth(): number {
    return this.growthState.development.totalGrowth;
  }

  getDevelopmentPointsUntilNextLevel(): number {
    const development = this.globalState.development;

    return development.getLevelRequirements(development.level) - development.points;
  }
}
