import { CloneLevelAutoupgraderProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class CloneLevelAutoupgraderDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.process.program as CloneLevelAutoupgraderProgram).calculateActionCount(this.process.threads);
  }
}
