import { TemplateResult, html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import {
  BaseComponent,
  GameAlert,
  GameAlertGroup,
  GAME_ALERT_GROUPS,
  TOGGLE_DETAILS_VALUES,
  GAME_ALERT_GROUP_LIST,
} from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { AlertFilterDialogCloseEvent } from './events';
import { AlertFilterDialogController } from './controller';
import { GAME_ALERT_GROUP_NAMES, GAME_ALERT_NAMES } from './constants';
import styles from './styles';

@localized()
@customElement('ca-alert-filter-dialog')
export class AlertFilterDialog extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: AlertFilterDialogController;

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  constructor() {
    super();

    this._controller = new AlertFilterDialogController(this);
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

    const someAlertsEnabled = this._controller.checkSomeAlertsEnabled();
    const toggleAllButtonText = someAlertsEnabled ? msg('Disable all alerts') : msg('Enable all alerts');
    const toggleAllButtonVariant = someAlertsEnabled
      ? TOGGLE_DETAILS_VALUES.buttonVariant.enabled
      : TOGGLE_DETAILS_VALUES.buttonVariant.disabled;

    return html`
      <form id="alert-filter-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg('Alert filter')}</h4>

          <div class=${bodyClasses}>
            <p class="hint">${msg('Enable alerts in filter to make them visible when event happens')}</p>

            <div>
              <sl-button variant=${toggleAllButtonVariant} size="medium" @click=${this.handleToggleAll}>
                ${toggleAllButtonText}
              </sl-button>
            </div>

            ${repeat(GAME_ALERT_GROUP_LIST, this.renderGroup)}
          </div>

          <sl-button slot="footer" size="medium" variant="default" @click=${this.handleClose}>
            ${COMMON_TEXTS.close()}
          </sl-button>
        </sl-dialog>
      </form>
    `;
  }

  private renderGroup = (group: GameAlertGroup) => {
    return html`
      <sl-divider></sl-divider>

      <sl-checkbox
        class="group-checkbox"
        size="medium"
        name="event"
        value=${group}
        ?checked=${this._controller.checkGroupHasEnabledAlerts(group)}
        @sl-change=${this.handleToggleGroup}
      >
        ${GAME_ALERT_GROUP_NAMES[group]()}
      </sl-checkbox>

      <div class="events-container">${repeat(GAME_ALERT_GROUPS[group], this.renderGameAlertCheckbox)}</div>
    `;
  };

  private renderGameAlertCheckbox = (gameAlert: GameAlert): TemplateResult => {
    return html`
      <sl-checkbox
        size="small"
        name="event"
        value=${gameAlert}
        ?checked=${this._controller.isAlertEnabled(gameAlert)}
        @sl-change=${this.handleToggleAlert}
      >
        ${GAME_ALERT_NAMES[gameAlert]()}
      </sl-checkbox>
    `;
  };

  private handleClose = () => {
    this.dispatchEvent(new AlertFilterDialogCloseEvent());
  };

  private handleToggleAlert = (event: Event) => {
    const target = event.target as SlCheckbox;
    const value = target.value as GameAlert;

    this._controller.toggleAlert(value, target.checked);
  };

  private handleToggleGroup = (event: Event) => {
    const target = event.target as SlCheckbox;
    const group = target.value as GameAlertGroup;

    const groupHasEnabledEvents = this._controller.checkGroupHasEnabledAlerts(group);
    this._controller.toggleGroup(group, !groupHasEnabledEvents);
  };

  private handleToggleAll = () => {
    const areAllEventsEnabled = this._controller.checkSomeAlertsEnabled();
    this._controller.toggleAllAlerts(!areAllEventsEnabled);
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();
  };
}
