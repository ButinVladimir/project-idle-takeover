import { CloneLevelAutoupgraderProgram } from '@state/mainframe-state';
import { BaseAutobuyerProgramDescriptionEffectRenderer } from './base-autobuyer-program-description-effect-renderer';

export class CloneLevelAutoupgraderDescriptionEffectRenderer extends BaseAutobuyerProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.process.program as CloneLevelAutoupgraderProgram).calculateActionCount(this.process.threads);
  }
}
