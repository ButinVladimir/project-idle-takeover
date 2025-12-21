import { MainframeProgramsAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class MainframeProgramsAutobuyerDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(this.threads);
  }

  protected getCurrentActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(this.currentThreads);
  }
}
