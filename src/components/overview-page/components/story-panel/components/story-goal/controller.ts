import { BaseController } from '@shared/index';
import { CloneTemplateName, SidejobName } from '@state/company-state';
import { ProgramName } from '@state/mainframe-state';

export class OverviewStoryGoalController extends BaseController {
  makeProgramUnlockMessage(programName: ProgramName): string {
    return this.unlockState.items.programs.makeUnlockNotificationMessage(programName, this.getFormattedTier());
  }

  makeCloneTemplateUnlockMessage(cloneTemplateName: CloneTemplateName): string {
    return this.unlockState.items.cloneTemplates.makeUnlockNotificationMessage(
      cloneTemplateName,
      this.getFormattedTier(),
    );
  }

  makeSidejobUnlockMessage(sidejobName: SidejobName): string {
    return this.unlockState.activities.sidejobs.makeUnlockSidejobMessage(sidejobName);
  }

  private getFormattedTier() {
    return this.formatter.formatTier(0);
  }
}
