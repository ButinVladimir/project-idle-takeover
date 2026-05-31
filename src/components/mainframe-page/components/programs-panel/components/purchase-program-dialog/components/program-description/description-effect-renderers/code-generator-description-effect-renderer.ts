import { CodeGeneratorProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class CodeGeneratorDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.codeBase;

  protected getProgramValue() {
    return (this.program as CodeGeneratorProgram).calculateDelta(1);
  }

  protected getOwnedProgramValue() {
    return (this!.ownedProgram as CodeGeneratorProgram).calculateDelta(1);
  }
}
