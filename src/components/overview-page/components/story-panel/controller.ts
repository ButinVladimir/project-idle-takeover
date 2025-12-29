import { BaseController } from '@shared/index';
import { IStoryGoal } from '@state/scenario-state';

export class OverviewStoryPanelController extends BaseController {
  listGoals(): IStoryGoal[] {
    return this.scenarioState.storyEvents.listGoals();
  }
}
