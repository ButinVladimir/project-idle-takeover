import { BaseController } from '@shared/index';

export class ProgramDescriptionTextController extends BaseController {
  get ram(): number {
    return this.mainframeState.hardware.ram.totalLevel;
  }

  get cores(): number {
    return this.mainframeState.hardware.cores.totalLevel;
  }
}
