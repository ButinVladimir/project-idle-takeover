import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-settings-page')
export class SettingsPage extends BaseComponent {
  static styles = styles;

  protected renderDesktop() {
    return html`
      <h3 class="title">${msg('Settings')}</h3>

      <ca-savefile-panel></ca-savefile-panel>
      <sl-divider></sl-divider>
      <ca-events-filter-panel></ca-events-filter-panel>
      <sl-divider></sl-divider>
      <ca-settings-form></ca-settings-form>
    `;
  }
}
