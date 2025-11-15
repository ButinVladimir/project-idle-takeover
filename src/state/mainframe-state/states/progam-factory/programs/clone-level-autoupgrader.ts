import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IClonesState } from '@state/clones-state';
import { AutobuyerProgramName } from '../types';
import { BaseProgram } from './base-program';

const { lazyInject } = decorators;

export class CloneLevelAutoupgraderProgram extends BaseProgram {
  public readonly name = AutobuyerProgramName.cloneLevelAutoupgrader;
  public readonly isAutoscalable = false;

  @lazyInject(TYPES.ActivityState)
  private _clonesState!: IClonesState;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    const actionsLeft = this.calculateActionCount(threads);

    this._clonesState.ownedClones.levelUpgrader.autoupgrade(actionsLeft);
  }

  calculateActionCount(threads: number): number {
    return (1 + this.tier) * threads;
  }
}
