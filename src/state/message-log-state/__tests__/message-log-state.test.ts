import 'reflect-metadata';
import { expect, describe, it, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import '@state/bindings';
import { ISettingsState } from '@state/settings-state/interfaces/settings-state';
import { container } from '@state/container';
import { TYPES } from '@state/types';
import { GameStateEvent } from '@shared/types';
import { IMessageLogState } from '../interfaces/message-log-state';

describe('Message log state', () => {
  const maxMessageLogSize = 3;
  let messageLogState: IMessageLogState;
  let settingsState: ISettingsState;
  let listener: (...args: any[]) => void;

  beforeAll(() => {
    messageLogState = container.get(TYPES.MessageLogState);
    settingsState = container.get(TYPES.SettingsState);
  });

  beforeEach(() => {
    messageLogState.clearMessages();

    listener = vi.fn();

    settingsState.messageEvents.toggleEvent(GameStateEvent.gameStarted, true);
    settingsState.setMessageLogSize(maxMessageLogSize);
  });

  afterEach(() => {});

  it('posts message when event is enabled', () => {
    const messageTextInput = 'text';
    messageLogState.postMessage(GameStateEvent.gameStarted, messageTextInput);

    const messages = messageLogState.getMessages();
    expect(messages).toHaveLength(1);
    const { id, event, messageText } = messages[0];

    expect(id).toBeTruthy();
    expect(event).toBe(GameStateEvent.gameStarted);
    expect(messageText).toBe(messageTextInput);
  });

  it('keeps messsage log size after posting a message', () => {
    for (let i = 0; i < 10; i++) {
      messageLogState.postMessage(GameStateEvent.gameStarted, 'text');
    }

    const messages = messageLogState.getMessages();
    expect(messages).toMatchObject([
      {
        event: GameStateEvent.gameStarted,
        parameters: { value: 7 },
      },
      {
        event: GameStateEvent.gameStarted,
        parameters: { value: 8 },
      },
      {
        event: GameStateEvent.gameStarted,
        parameters: { value: 9 },
      },
    ]);
  });

  it('does not post message when event is disabled', () => {
    settingsState.messageEvents.toggleEvent(GameStateEvent.gameStarted, false);

    messageLogState.postMessage(GameStateEvent.gameStarted, 'text');

    const messages = messageLogState.getMessages();
    expect(messages).toHaveLength(0);
  });

  // it('triggers ui update after posting message', () => {
  //   messageLogState.postMessage(GameStateEvent.gameStarted);

  //   expect(listener!).toHaveBeenCalled();
  // });

  // it('triggers ui update after clearing messages', () => {
  //   messageLogState.clearMessages();

  //   expect(listener!).toHaveBeenCalled();
  // });

  it('does not trigger ui update after removing handler', () => {
    messageLogState.clearMessages();

    expect(listener!).not.toHaveBeenCalled();
  });
});
