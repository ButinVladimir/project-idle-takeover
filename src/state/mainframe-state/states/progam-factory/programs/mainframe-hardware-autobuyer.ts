import { AutomationProgram } from '../types';
import { BaseProgram } from './base-program';

export class MainframeHardwareAutobuyerProgram extends BaseProgram {
  public readonly name = AutomationProgram.mainframeHardwareAutobuyer;
  public readonly isAutoscalable = false;

  handlePerformanceUpdate(): void {}

  perform(threads: number): void {
    const actionsLeft = this.calculateActionCount(threads);

    this.mainframeState.hardware.upgrader.autoupgrade(actionsLeft);
  }

  calculateActionCount(threads: number): number {
    return (1 + this.tier) * threads;
  }
}
