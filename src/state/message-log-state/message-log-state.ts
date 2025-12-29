import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import type { ISettingsState } from '@state/settings-state/interfaces/settings-state';
import type { IFormatter } from '@shared/interfaces/formatter';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { MessageEvent } from '@shared/types';
import { IMessageLogState, IMessage } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class MessageLogState implements IMessageLogState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.SettingsState)
  private _settingsState!: ISettingsState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  private readonly _messages: IMessage[];
  private readonly _toasts: IMessage[];

  constructor() {
    this._messages = [];
    this._toasts = [];

    this._stateUiConnector.registerEventEmitter(this, ['_messages', '_toasts']);
  }

  postMessage(event: MessageEvent, messageText: string, postToast = true) {
    if (!this._settingsState.messageEvents.isEventEnabled(event)) {
      return;
    }

    const messageDate = new Date();
    const formattedTime = this._formatter.formatDateTime(messageDate);
    this._messages.push({
      id: uuid(),
      event,
      messageText: msg(str`[${formattedTime}] ${messageText}`),
    });

    while (this._messages.length > this._settingsState.messageLogSize) {
      this._messages.shift();
    }

    if (postToast && this._settingsState.toastDuration > 0) {
      this._toasts.push({
        id: uuid(),
        event,
        messageText: messageText,
      });

      while (this._toasts.length > this._settingsState.messageLogSize) {
        this._toasts.shift();
      }
    }
  }

  getMessages(): IMessage[] {
    return this._messages;
  }

  clearMessages() {
    this._messages.length = 0;
  }

  getToasts(): IMessage[] {
    const toastsBatch = this._toasts.splice(0);

    return toastsBatch;
  }
}
