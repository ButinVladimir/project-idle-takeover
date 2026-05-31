import { CloneLevelAutoupgraderProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class CloneLevelAutoupgraderDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as CloneLevelAutoupgraderProgram).calculateActionCount(1);
  }

  protected getOwnedActionCount(): number {
    return (this.ownedProgram as CloneLevelAutoupgraderProgram).calculateActionCount(1);
  }
}
