import { BaseController } from '@shared/index';

export class FastForwardingScreenController extends BaseController {
  get accumulatedTime(): number {
    return this.globalState.time.accumulatedTime;
  }

  stopFastForwarding() {
    this.app.stopFastForwarding();
  }
}
