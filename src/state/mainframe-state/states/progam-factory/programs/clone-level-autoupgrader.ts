import { type ICompanyState } from '@state/company-state';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { AutobuyerProgramName } from '../types';
import { BaseProgram } from './base-program';

const { lazyInject } = decorators;

export class CloneLevelAutoupgraderProgram extends BaseProgram {
  public readonly name = AutobuyerProgramName.cloneLevelAutoupgrader;
  public readonly isAutoscalable = false;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    const actionsLeft = this.calculateActionCount(threads);

    this._companyState.clones.levelUpgrader.autoupgrade(actionsLeft);
  }

  calculateActionCount(threads: number): number {
    return (1 + this.tier) * threads;
  }
}
