import { BaseController } from '@shared/index';
import { IMessage } from '@state/message-log-state';

export class ToastsController extends BaseController {
  getToasts(): IMessage[] {
    return this.messageLogState.getToasts();
  }

  getToastDuration(): number {
    return this.settingsState.toastDuration;
  }
}
