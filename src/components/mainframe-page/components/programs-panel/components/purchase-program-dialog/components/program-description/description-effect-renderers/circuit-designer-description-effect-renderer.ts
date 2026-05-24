import { CircuitDesignerProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class CircuitDesignerDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.computationalBase;

  protected getProgramValue() {
    return (this.program as CircuitDesignerProgram).calculateDelta(1);
  }

  protected getOwnedProgramValue() {
    return (this!.ownedProgram as CircuitDesignerProgram).calculateDelta(1);
  }
}
