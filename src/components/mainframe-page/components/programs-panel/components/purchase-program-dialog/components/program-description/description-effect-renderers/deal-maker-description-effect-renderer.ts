import { DealMakerProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class DealMakerDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.rewards;

  protected getProgramValue() {
    return (this.program as DealMakerProgram).calculateDelta(1);
  }

  protected getOwnedProgramValue() {
    return (this!.ownedProgram as DealMakerProgram).calculateDelta(1);
  }
}
