import { DealMakerProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class DealMakerDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.rewards;

  getProgramValue(threads: number): number {
    return (this.program as DealMakerProgram).calculateDelta(threads);
  }
}
