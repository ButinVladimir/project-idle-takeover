import { MainframeHardwareAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class MainframeHardwareAutobuyerDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.process.program as MainframeHardwareAutobuyerProgram).calculateActionCount(this.process.threads);
  }
}
