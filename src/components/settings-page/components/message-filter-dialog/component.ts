import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import {
  BaseComponent,
  MessageEvent,
  MessageEventGroup,
  MESSAGE_EVENT_GROUPS,
  MESSAGE_EVENT_GROUP_LIST,
  TOGGLE_DETAILS_VALUES,
} from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { MessageFilterDialogCloseEvent } from './events';
import { MessageFilterDialogController } from './controller';
import { MESSAGE_EVENT_GROUP_NAMES, MESSAGE_EVENT_NAMES } from './constants';
import styles from './styles';

@localized()
@customElement('ca-message-filter-dialog')
export class MessageFilterDialog extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: MessageFilterDialogController;

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  constructor() {
    super();

    this._controller = new MessageFilterDialogController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    const bodyClasses = classMap({
      body: true,
      desktop: desktop,
      mobile: !desktop,
    });

    const someEventsEnabled = this._controller.checkSomeEventsEnabled();
    const toggleAllButtonText = someEventsEnabled ? msg('Disable all events') : msg('Enable all events');
    const toggleAllButtonVariant = someEventsEnabled
      ? TOGGLE_DETAILS_VALUES.buttonVariant.enabled
      : TOGGLE_DETAILS_VALUES.buttonVariant.disabled;

    return html`
      <form id="message-filter-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Message filter')}</h4>

          <div class=${bodyClasses}>
            <p class="hint">
              ${msg('Enable events in filter to receive messages about them in the log and as popups')}
            </p>

            <div>
              <sl-button variant=${toggleAllButtonVariant} size="medium" @click=${this.handleToggleAll}>
                ${toggleAllButtonText}
              </sl-button>
            </div>

            ${repeat(MESSAGE_EVENT_GROUP_LIST, this.renderGroup)}
          </div>

          <sl-button slot="footer" size="medium" variant="default" @click=${this.handleClose}>
            ${COMMON_TEXTS.close()}
          </sl-button>
        </sl-dialog>
      </form>
    `;
  }

  private renderGroup = (group: MessageEventGroup) => {
    return html`
      <sl-divider></sl-divider>

      <sl-checkbox
        class="group-checkbox"
        size="medium"
        name="event"
        value=${group}
        ?checked=${this._controller.checkGroupHasEnabledEvents(group)}
        @sl-change=${this.handleToggleGroup}
      >
        ${MESSAGE_EVENT_GROUP_NAMES[group]()}
      </sl-checkbox>

      <div class="events-container">${repeat(MESSAGE_EVENT_GROUPS[group], this.renderEventCheckbox)}</div>
    `;
  };

  private renderEventCheckbox = (event: MessageEvent): any => {
    return html`
      <sl-checkbox
        size="small"
        name="event"
        value=${event}
        ?checked=${this._controller.isEventEnabled(event)}
        @sl-change=${this.handleToggleEvent}
      >
        ${MESSAGE_EVENT_NAMES[event]()}
      </sl-checkbox>
    `;
  };

  private handleClose = () => {
    this.dispatchEvent(new MessageFilterDialogCloseEvent());
  };

  private handleToggleEvent = (event: Event) => {
    const target = event.target as SlCheckbox;
    const value = target.value as MessageEvent;

    this._controller.toggleEvent(value, target.checked);
  };

  private handleToggleGroup = (event: Event) => {
    const target = event.target as SlCheckbox;
    const group = target.value as MessageEventGroup;

    const groupHasEnabledEvents = this._controller.checkGroupHasEnabledEvents(group);
    this._controller.toggleGroup(group, !groupHasEnabledEvents);
  };

  private handleToggleAll = () => {
    const areAllEventsEnabled = this._controller.checkSomeEventsEnabled();
    this._controller.toggleAllEvents(!areAllEventsEnabled);
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();
  };
}
