import { MainframeProgramsAutobuyerProgram } from '@state/mainframe-state';
import { BaseAutobuyerProgramDescriptionEffectRenderer } from './base-autobuyer-program-description-effect-renderer';

export class MainframeProgramsAutobuyerDescriptionEffectRenderer extends BaseAutobuyerProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as MainframeProgramsAutobuyerProgram).calculateActionCount(1);
  }

  protected getOwnedActionCount(): number {
    return (this.ownedProgram as MainframeProgramsAutobuyerProgram).calculateActionCount(1);
  }
}
