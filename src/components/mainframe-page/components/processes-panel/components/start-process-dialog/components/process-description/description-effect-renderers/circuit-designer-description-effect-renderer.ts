import { CircuitDesignerProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class CircuitDesignerDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.computationalBase;

  getProgramValue(threads: number): number {
    return (this.program as CircuitDesignerProgram).calculateDelta(threads);
  }
}
