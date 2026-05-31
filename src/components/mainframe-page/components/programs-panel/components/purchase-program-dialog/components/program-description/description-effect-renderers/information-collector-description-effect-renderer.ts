import { InformationCollectorProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class InformationCollectorDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.connectivity;

  protected getProgramValue() {
    return (this.program as InformationCollectorProgram).calculateDelta(1);
  }

  protected getOwnedProgramValue() {
    return (this!.ownedProgram as InformationCollectorProgram).calculateDelta(1);
  }
}
