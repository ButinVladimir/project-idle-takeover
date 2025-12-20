import { html, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { msg, localized } from '@lit/localize';
import { customElement, queryAll } from 'lit/decorators.js';
import { BaseComponent, Milestone, IncomeSource } from '@shared/index';
import { INCOME_SOURCE_NAMES, STATISTIC_PAGE_TEXTS } from '../../../../constants';
import { StatisticsMoneyIncomeController } from './controller';
import { statisticsPanelContentStyle } from '../../../../styles';

@localized()
@customElement('ca-statistics-money-income')
export class StatisticsMoneyIncome extends BaseComponent {
  static styles = statisticsPanelContentStyle;

  hasPartialUpdate = true;

  private _controller: StatisticsMoneyIncomeController;

  @queryAll('div[data-name]')
  private _incomeSourceElements!: NodeListOf<HTMLDivElement>;

  private _totalIncomeRef = createRef<HTMLDivElement>();

  constructor() {
    super();

    this._controller = new StatisticsMoneyIncomeController(this);
  }

  protected renderDesktop() {
    return html`
      <sl-details>
        <h4 class="title" slot="summary">${msg('Money')}</h4>

        <div class="parameters-table">
          ${this.renderIncomeSource(IncomeSource.program)}
          ${this._controller.isMilestoneUnlocked(Milestone.unlockedCompanyManagement)
            ? this.renderIncomeSource(IncomeSource.sidejob)
            : nothing}
          ${this._controller.isMilestoneUnlocked(Milestone.unlockedPrimaryActivity)
            ? this.renderIncomeSource(IncomeSource.primaryActivity)
            : nothing}

          <div>${STATISTIC_PAGE_TEXTS.total()}</div>
          <div ${ref(this._totalIncomeRef)}></div>
        </div>
      </sl-details>
    `;
  }

  private renderIncomeSource = (incomeSource: IncomeSource) => {
    return html`
      <div>${INCOME_SOURCE_NAMES[incomeSource]()}</div>
      <div data-name=${incomeSource}></div>
    `;
  };

  handlePartialUpdate = () => {
    const formatter = this._controller.formatter;
    let totalValue = 0;

    this._incomeSourceElements.forEach((element) => {
      const incomeSource = element.dataset.name as IncomeSource;
      const value = this._controller.getMoneyIncome(incomeSource);
      totalValue += value;

      element.textContent = formatter.formatNumberFloat(value);
    });

    if (this._totalIncomeRef.value) {
      this._totalIncomeRef.value.textContent = formatter.formatNumberFloat(totalValue);
    }
  };
}
