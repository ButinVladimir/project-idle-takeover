import { InformationCollectorProgram } from '@state/mainframe-state';
import { RewardParameter } from '@shared/index';
import { BaseMultiplierDescriptionEffectRenderer } from './base-multiplier-program-description-effect-renderer';

export class InformationCollectorDescriptionEffectRenderer extends BaseMultiplierDescriptionEffectRenderer {
  protected parameterName = RewardParameter.connectivity;

  getProgramValue(threads: number): number {
    return (this.program as InformationCollectorProgram).calculateDelta(threads);
  }
}
