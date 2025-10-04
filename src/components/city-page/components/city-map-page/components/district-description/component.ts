import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { localized, msg } from '@lit/localize';
import { BaseComponent } from '@shared/base-component';
import { COMMON_TEXTS, DISTRICT_NAMES, DISTRICT_TYPE_TEXTS, FACTION_TEXTS } from '@texts/index';
import { DISTRICT_STATE_TEXTS } from '../../../../constants';
import { CityMapDistrictDescriptionController } from './controller';
import cityPageDistrictDescriptionStyles from './styles';

@localized()
@customElement('ca-city-map-district-description')
export class CityMapDistrictDescription extends BaseComponent {
  static styles = cityPageDistrictDescriptionStyles;

  @property({
    attribute: 'district',
    type: Number,
  })
  district?: number | null;

  private _controller: CityMapDistrictDescriptionController;

  constructor() {
    super();

    this._controller = new CityMapDistrictDescriptionController(this);
  }

  protected renderDesktop() {
    if (this.district === undefined || this.district === null) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const districtState = this._controller.getDistrictState(this.district);

    const formattedTier = formatter.formatTier(districtState.parameters.influence.tier);

    return html`
      <p>${DISTRICT_NAMES[districtState.name]()}</p>

      <p>
        ${COMMON_TEXTS.parameterValue(msg('District type'), DISTRICT_TYPE_TEXTS[districtState.districtType].title())}
      </p>

      ${this._controller.isInfluenceUnlocked()
        ? html`<p>${COMMON_TEXTS.parameterValue(COMMON_TEXTS.tier(), formattedTier)}</p>`
        : nothing}
      ${this._controller.areFactionsUnlocked()
        ? html`<p>${COMMON_TEXTS.parameterValue(msg('Faction'), FACTION_TEXTS[districtState.faction].title())}</p>`
        : nothing}

      <p>${COMMON_TEXTS.parameterValue(msg('State'), DISTRICT_STATE_TEXTS[districtState.state].title())}</p>
    `;
  }
}
