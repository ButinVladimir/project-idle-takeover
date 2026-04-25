import { MainframeHardwareAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class MainframeHardwareAutobuyerDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeHardwareAutobuyerProgram).calculateActionCount(1);
  }

  protected getOwnedActionCount(): number {
    return (this.ownedProgram as MainframeHardwareAutobuyerProgram).calculateActionCount(1);
  }
}
