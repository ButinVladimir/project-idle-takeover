import { ContractAutostarterProgram } from '@state/mainframe-state';
import { BaseAutomationProgramDescriptionEffectRenderer } from './base-automation-program-description-effect-renderer';

export class ContractAutostarterDescriptionEffectRenderer extends BaseAutomationProgramDescriptionEffectRenderer {
  protected getActionCount(): number {
    return (this.program as ContractAutostarterProgram).calculateActionCount(this.threads);
  }

  protected getCurrentActionCount(): number {
    return (this.program as ContractAutostarterProgram).calculateActionCount(this.currentThreads);
  }
}
