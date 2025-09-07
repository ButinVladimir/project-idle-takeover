import { BaseController } from '@shared/base-controller';
import { IStoryGoal } from '@state/scenario-state';

export class OverviewStoryPanelController extends BaseController {
  listGoals(): IStoryGoal[] {
    return this.scenarioState.storyEvents.listGoals();
  }
}
