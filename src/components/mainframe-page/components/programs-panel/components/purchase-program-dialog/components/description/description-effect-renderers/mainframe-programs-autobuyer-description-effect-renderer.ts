import { MainframeProgramsAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class MainframeProgramsAutobuyerDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(1);
  }

  protected getOwnedActionCount(): number {
    return (this.ownedProgram as MainframeProgramsAutobuyerProgram).calculateActionCount(1);
  }
}
