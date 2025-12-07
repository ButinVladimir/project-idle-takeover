import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { createRef, ref } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { type IClone } from '@state/clones-state';
import { ATTRIBUTE_TEXTS, CLONE_TEMPLATE_TEXTS, COMMON_TEXTS, SKILL_TEXTS } from '@texts/index';
import {
  BaseComponent,
  ATTRIBUTES,
  SKILLS,
  Attribute,
  Skill,
  getHighlightValueClass,
  getHighlightValueClassMap,
} from '@shared/index';
import { PurchaseCloneDialogDescriptionTextController } from './controller';
import { temporaryCloneContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-purchase-clone-dialog-description')
export class PurchaseCloneDialogDescription extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  hasPartialUpdate = true;

  @consume({ context: temporaryCloneContext, subscribe: true })
  private _clone?: IClone;

  private _costElRef = createRef<HTMLSpanElement>();

  private _controller: PurchaseCloneDialogDescriptionTextController;

  constructor() {
    super();

    this._controller = new PurchaseCloneDialogDescriptionTextController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    if (!this._clone) {
      return nothing;
    }

    return html`
      <p class="overview">${CLONE_TEMPLATE_TEXTS[this._clone.templateName].overview()}</p>

      <p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.cost(), html`<span ${ref(this._costElRef)}></span>`)}</p>
      ${this.renderSynchronization()} ${this.renderExperienceMultiplier()} ${this.renderParameters(desktop)}
    `;
  }

  private renderSynchronization = () => {
    const formatter = this._controller.formatter;

    const synchronization = this._controller.getCloneSynchronization(this._clone!.templateName, this._clone!.tier);
    const availableSynchronization = this._controller.availableSynchronization;

    const formattedCloneSynchronization = formatter.formatNumberDecimal(synchronization);
    const formattedAvailableSynchronization = formatter.formatNumberDecimal(availableSynchronization);

    const valid = synchronization <= availableSynchronization;

    const synchronizationClasses = getHighlightValueClassMap(valid);
    const synchronizationValue = html`<span class=${synchronizationClasses}
      >${formattedCloneSynchronization} / ${formattedAvailableSynchronization}</span
    >`;

    return html`<p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.synchronization(), synchronizationValue)}</p>`;
  };

  private renderParameters = (desktop: boolean) => {
    const attributesSkillsTablesClasses = classMap({
      'attributes-skills-tables': true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <div class=${attributesSkillsTablesClasses}>
        <div>
          <h5 class="title">${COMMON_TEXTS.attributes()}</h5>
          <div class="attributes-skills-table">${ATTRIBUTES.map(this.renderAttribute)}</div>
        </div>

        <div>
          <h5 class="title">${COMMON_TEXTS.skills()}</h5>
          <div class="attributes-skills-table">${SKILLS.map(this.renderSkill)}</div>
        </div>
      </div>
    `;
  };

  private renderAttribute = (attribute: Attribute) => {
    const value = this._clone!.getTotalAttributeValue(attribute);
    const formattedValue = this._controller.formatter.formatNumberDecimal(value);

    return html`
      <div>${ATTRIBUTE_TEXTS[attribute]()}</div>
      <div>${formattedValue}</div>
    `;
  };

  private renderSkill = (skill: Skill) => {
    const value = this._clone!.getTotalSkillValue(skill);
    const formattedValue = this._controller.formatter.formatNumberDecimal(value);

    return html`
      <div>${SKILL_TEXTS[skill]()}</div>
      <div>${formattedValue}</div>
    `;
  };

  private renderExperienceMultiplier = () => {
    const formattedValue = this._controller.formatter.formatNumberFloat(this._clone!.experienceMultiplier);

    return html`
      <p class="text">${COMMON_TEXTS.parameterRow(COMMON_TEXTS.experienceMultiplier(), formattedValue)}</p>
    `;
  };

  handlePartialUpdate = () => {
    if (!this._costElRef.value) {
      return;
    }

    const cost = this._controller.getCloneCost(this._clone!.templateName, this._clone!.tier, this._clone!.level);
    const money = this._controller.money;

    const formattedCost = this._controller.formatter.formatNumberFloat(cost);
    const className = getHighlightValueClass(money >= cost);

    this._costElRef.value.textContent = formattedCost;
    this._costElRef.value.className = className;
  };
}
