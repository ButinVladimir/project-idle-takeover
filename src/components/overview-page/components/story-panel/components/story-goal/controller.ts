import { BaseController } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';

export class OverviewStoryGoalController extends BaseController {
  isStoryEventUnlocked(storyEventName: string): boolean {
    return this.scenarioState.storyEvents.isEventUnlocked(storyEventName);
  }

  makeProgramUnlockMessage(programName: ProgramName): string {
    return this.unlockState.items.programs.makeUnlockNotificationMessage(programName, this.getFormattedTier());
  }

  makeCloneTemplateUnlockMessage(cloneTemplateName: string): string {
    return this.unlockState.items.cloneTemplates.makeUnlockNotificationMessage(
      cloneTemplateName,
      this.getFormattedTier(),
    );
  }

  makeSidejobUnlockMessage(sidejobName: string): string {
    return this.unlockState.activities.sidejobs.makeUnlockActivityMessage(sidejobName);
  }

  private getFormattedTier() {
    return this.formatter.formatTier(0);
  }
}
