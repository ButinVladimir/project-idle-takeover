import { MainframeProgramsAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutobuyerProgramDescriptionEffectRenderer } from './base-autobuyer-program-description-effect-renderer';

export class MainframeProgramsAutobuyerDescriptionEffectRenderer extends BaseAutobuyerProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(this.threads);
  }

  protected getCurrentActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(this.currentThreads);
  }
}
