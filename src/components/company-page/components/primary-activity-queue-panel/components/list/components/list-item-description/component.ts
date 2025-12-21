import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { BaseComponent } from '@shared/index';
import { PrimaryActivityState, type IPrimaryActivity } from '@state/activity-state';
import { primaryActivityContext } from '../list-item/contexts';
import styles from './styles';

@localized()
@customElement('ca-primary-activity-queue-list-item-description')
export class PrimaryActivityQueueListItemDescription extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'details-visible',
    type: Boolean,
  })
  public detailsVisible!: boolean;

  @consume({ context: primaryActivityContext, subscribe: true })
  private _primaryActivity?: IPrimaryActivity;

  protected renderDesktop() {
    if (!this._primaryActivity) {
      return nothing;
    }

    if (this._primaryActivity.state === PrimaryActivityState.toBeRemoved) {
      return nothing;
    }

    if (this._primaryActivity.state === PrimaryActivityState.inactive) {
      return html`${msg('Activity has not started yet')}`;
    }

    return html` ${this.renderTypeSpecificDescription()} ${this.renderRewards()} `;
  }

  private renderTypeSpecificDescription = () => {
    switch (this._primaryActivity!.type) {
      case 'contract':
        return html`
          <ca-primary-activity-queue-list-item-contract-description ?details-visible=${this.detailsVisible}>
          </ca-primary-activity-queue-list-item-contract-description>
        `;
    }
  };

  private renderRewards = () => {
    if (!this.detailsVisible) {
      return nothing;
    }

    return html`<ca-primary-activity-queue-list-item-rewards></ca-primary-activity-queue-list-item-rewards>`;
  };
}
