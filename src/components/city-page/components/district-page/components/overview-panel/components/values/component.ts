import { html, nothing } from 'lit';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { COMMON_TEXTS, DISTRICT_TYPE_TEXTS, FACTION_TEXTS } from '@texts/index';
import { DISTRICT_STATE_TEXTS } from '../../../../../../constants';
import { CityDistrictOverviewPanelValuesController } from './controller';
import { districtIndexContext } from '../../../../contexts';
import { DISTRICT_TIER_HINT } from '../../../../constants';
import styles from './styles';

@localized()
@customElement('ca-city-district-overview-panel-values')
export class CityDistrictOverviewPanelValues extends BaseComponent {
  static styles = styles;

  @consume({ context: districtIndexContext, subscribe: true })
  private _districtIndex?: number;

  private _controller: CityDistrictOverviewPanelValuesController;

  constructor() {
    super();

    this._controller = new CityDistrictOverviewPanelValuesController(this);
  }

  protected renderDesktop() {
    if (this._districtIndex === undefined) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const districtState = this._controller.getDistrictState(this._districtIndex);

    const formattedTier = formatter.formatTier(districtState.parameters.influence.tier);
    const formattedDifficulty = formatter.formatNumberFloat(
      districtState.parameters.influence.getTierRequirements(districtState.parameters.influence.tier),
    );

    return html`
      <p class="text">
        ${COMMON_TEXTS.parameterRow(msg('District type'), DISTRICT_TYPE_TEXTS[districtState.districtType].title())}

        <sl-tooltip>
          <span slot="content">${DISTRICT_TYPE_TEXTS[districtState.districtType].overview()}</span>

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </p>

      <p class="text">
        ${COMMON_TEXTS.parameterRow(msg('Difficulty'), formattedDifficulty)}

        <sl-tooltip>
          <span slot="content"
            >${msg(`Difficulty indicates how long it takes to capture district or upgrade it to the next tier.`)}</span
          >

          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </p>

      ${this._controller.isInfluenceUnlocked()
        ? html`
            <p class="text">
              ${COMMON_TEXTS.parameterRow(COMMON_TEXTS.tier(), formattedTier)}

              <sl-tooltip>
                <span slot="content">${DISTRICT_TIER_HINT()}</span>

                <sl-icon name=${HINT_ICON}></sl-icon>
              </sl-tooltip>
            </p>
          `
        : nothing}
      ${this._controller.areFactionsUnlocked()
        ? html`
            <p class="text">
              ${COMMON_TEXTS.parameterRow(COMMON_TEXTS.faction(), FACTION_TEXTS[districtState.faction].title())}

              <sl-tooltip>
                <span slot="content">${FACTION_TEXTS[districtState.faction].overview()}</span>

                <sl-icon name=${HINT_ICON}></sl-icon>
              </sl-tooltip>
            </p>
          `
        : nothing}

      <p class="text">
        ${COMMON_TEXTS.parameterRow(msg('State'), DISTRICT_STATE_TEXTS[districtState.state].title())}

        <sl-tooltip>
          <span slot="content">${DISTRICT_STATE_TEXTS[districtState.state].hint()}</span>
          <sl-icon name=${HINT_ICON}></sl-icon>
        </sl-tooltip>
      </p>
    `;
  }
}
