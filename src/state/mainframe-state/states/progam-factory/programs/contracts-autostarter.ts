import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IAutomationState } from '@state/automation-state';
import { AutomationProgram } from '../types';
import { BaseProgram } from './base-program';

const { lazyInject } = decorators;

export class ContractAutostarterProgram extends BaseProgram {
  public readonly name = AutomationProgram.contractAutostarter;
  public readonly isAutoscalable = false;

  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    const actionsLeft = this.calculateActionCount(threads);

    this._automationState.contracts.starter.autostart(actionsLeft);
  }

  calculateActionCount(threads: number): number {
    return (1 + this.tier) * threads;
  }
}
