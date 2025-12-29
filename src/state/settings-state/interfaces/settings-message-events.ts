import { ISerializeable, MessageEvent, MessageEventGroup } from '@shared/index';
import { SettingsMessageEventsSerializedState } from '../serialized-states';

export interface ISettingsMessageEvents extends ISerializeable<SettingsMessageEventsSerializedState> {
  isEventEnabled(event: MessageEvent): boolean;
  checkGroupHasEnabledEvents(group: MessageEventGroup): boolean;
  checkSomeEventsEnabled(): boolean;
  toggleEvent(event: MessageEvent, enabled: boolean): void;
  toggleGroup(group: MessageEventGroup, enabled: boolean): void;
  toggleAllEvents(enabled: boolean): void;
}
