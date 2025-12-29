import { BaseController, MessageEvent, MessageEventGroup } from '@shared/index';

export class MessageFilterDialogController extends BaseController {
  isEventEnabled(event: MessageEvent): boolean {
    return this.settingsState.messageEvents.isEventEnabled(event);
  }

  checkGroupHasEnabledEvents(group: MessageEventGroup): boolean {
    return this.settingsState.messageEvents.checkGroupHasEnabledEvents(group);
  }

  checkSomeEventsEnabled(): boolean {
    return this.settingsState.messageEvents.checkSomeEventsEnabled();
  }

  toggleEvent(event: MessageEvent, enabled: boolean) {
    this.settingsState.messageEvents.toggleEvent(event, enabled);
    this.host.requestUpdate();
  }

  toggleGroup(group: MessageEventGroup, enabled: boolean) {
    this.settingsState.messageEvents.toggleGroup(group, enabled);
    this.host.requestUpdate();
  }

  toggleAllEvents(enabled: boolean) {
    this.settingsState.messageEvents.toggleAllEvents(enabled);
    this.host.requestUpdate();
  }
}
