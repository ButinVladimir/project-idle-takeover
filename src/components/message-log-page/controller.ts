import { BaseController } from '@shared/index';

export class MessageLogBarController extends BaseController {
  clearMessages() {
    this.messageLogState.clearMessages();
  }
}
