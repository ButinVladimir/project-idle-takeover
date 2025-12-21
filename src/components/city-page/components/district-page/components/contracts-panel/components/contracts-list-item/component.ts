import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { consume, provide } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, HINT_ICON } from '@shared/index';
import { CONTRACT_TEXTS } from '@texts/index';
import { contractNameContext } from './contexts';
import { districtIndexContext } from '../../../../contexts';
import styles from './styles';
import { CityDistrictContractsListItemController } from './controller';

@localized()
@customElement('ca-city-district-contracts-list-item')
export class CityDistrictContractListItem extends BaseComponent {
  static styles = styles;

  @provide({ context: contractNameContext })
  @property({
    attribute: 'contract-name',
    type: String,
  })
  contractName!: string;

  protected hasMobileRender = true;

  private _controller: CityDistrictContractsListItemController;

  constructor() {
    super();

    this._controller = new CityDistrictContractsListItemController(this);
  }

  @consume({ context: districtIndexContext, subscribe: true })
  private _districtIndex?: number;

  protected renderMobile() {
    if (this._districtIndex === undefined) {
      return nothing;
    }

    return html`<div class="host-content mobile">
      ${this.renderDescription()} ${this.renderAvailable(true)} ${this.renderGenerationProgress()}
    </div>`;
  }

  protected renderDesktop() {
    if (this._districtIndex === undefined) {
      return nothing;
    }

    return html`<div class="host-content desktop">
      ${this.renderDescription()} ${this.renderAvailable(false)} ${this.renderGenerationProgress()}
    </div>`;
  }

  private renderDescription = () => {
    return html`<div class="contract">
      <div class="description">
        <p class="title">
          ${CONTRACT_TEXTS[this.contractName].title()}

          <sl-tooltip>
            <span slot="content">${CONTRACT_TEXTS[this.contractName].overview()}</span>

            <sl-icon name=${HINT_ICON}></sl-icon>
          </sl-tooltip>
        </p>
      </div>
    </div> `;
  };

  private renderAvailable = (isMobile: boolean) => {
    const formatter = this._controller.formatter;
    const formattedValue = formatter.formatNumberDecimal(
      this._controller.getAvailableContractAmount(this.contractName, this._districtIndex!),
    );

    return html`<div class="available">${isMobile ? msg(str`Available: ${formattedValue}`) : formattedValue}</div>`;
  };

  private renderGenerationProgress = () => {
    return html`<div class="generation">
      <ca-city-district-contracts-list-item-generation-progress></ca-city-district-contracts-list-item-generation-progress>
    </div>`;
  };
}
