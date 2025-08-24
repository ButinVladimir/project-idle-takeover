import { MainframeHardwareAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutobuyerProgramDescriptionEffectRenderer } from './base-autobuyer-program-description-effect-renderer';

export class MainframeHardwareAutobuyerDescriptionEffectRenderer extends BaseAutobuyerProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeHardwareAutobuyerProgram).calculateActionCount(this.threads);
  }

  protected getCurrentActionCount(): number {
    return (this.program as MainframeHardwareAutobuyerProgram).calculateActionCount(this.currentThreads);
  }
}
