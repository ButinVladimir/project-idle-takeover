import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { BaseComponent, Milestone, HINT_ICON } from '@shared/index';
import { MILESTONE_TEXTS } from '@texts/index';
import { OverviewReachedMilestonesController } from './controller';
import { unlockedContentStyles } from '../../styles';

@localized()
@customElement('ca-overview-reached-milestones')
export class OverviewReachedMilestones extends BaseComponent {
  static styles = unlockedContentStyles;

  private _controller: OverviewReachedMilestonesController;

  constructor() {
    super();

    this._controller = new OverviewReachedMilestonesController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Milestones')}</h4>

        <div class="content-table">${this.renderList()}</div>
      </sl-details>
    `;
  }

  private renderList = () => {
    const items = this._controller.listReachedMilestones();

    return items.map(this.renderListItem);
  };

  private renderListItem = (milestones: Milestone) => {
    const title = MILESTONE_TEXTS[milestones].title();
    const hint = MILESTONE_TEXTS[milestones].hint();

    return html`
      <span>
        ${title}

        <sl-tooltip>
          <span slot="content"> ${hint} </span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </span>
    `;
  };
}
