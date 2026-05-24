import { CodeGeneratorProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class CodeGeneratorDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.codeBase;

  getProgramValue(threads: number): number {
    return (this.program as CodeGeneratorProgram).calculateDelta(threads);
  }
}
