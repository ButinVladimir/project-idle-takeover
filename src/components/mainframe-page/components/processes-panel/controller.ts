import { BaseController } from '@shared/index';

export class ProcessesPanelController extends BaseController {
  get availableCores(): number {
    return this.mainframeState.processes.availableCores;
  }

  get maxCores(): number {
    return this.mainframeState.hardware.cores.totalLevel;
  }

  get availableRam(): number {
    return this.mainframeState.processes.availableRam;
  }

  get maxRam(): number {
    return this.mainframeState.hardware.ram.totalLevel;
  }
}
