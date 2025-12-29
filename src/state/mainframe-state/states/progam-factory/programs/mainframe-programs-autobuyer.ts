import { AutomationProgram } from '../types';
import { BaseProgram } from './base-program';

export class MainframeProgramsAutobuyerProgram extends BaseProgram {
  public readonly name = AutomationProgram.mainframeProgramsAutobuyer;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    const actionsLeft = this.calculateActionCount(threads);

    this.mainframeState.programs.upgrader.autoupgrade(actionsLeft);
  }

  calculateActionCount(threads: number): number {
    return (1 + this.tier) * threads;
  }
}
