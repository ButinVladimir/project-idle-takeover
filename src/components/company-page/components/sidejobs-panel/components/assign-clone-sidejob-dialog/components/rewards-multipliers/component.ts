import { html, nothing } from 'lit';
import { localized, msg } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ATTRIBUTE_TEXTS, COMMON_TEXTS, SKILL_TEXTS } from '@texts/index';
import { type ISidejob } from '@state/activity-state';
import {
  BaseComponent,
  Attribute,
  ATTRIBUTES,
  BaseController,
  diffFormatterParameters,
  getHighlightDifferenceClassMap,
  Skill,
  SKILLS,
} from '@shared/index';
import { existingSidejobContext, temporarySidejobContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-rewards-multipliers')
export class AssignCloneSidejobDialogRewardsMultipliers extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;

  private _controller: BaseController;

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  @consume({ context: existingSidejobContext, subscribe: true })
  private _existingSidejob?: ISidejob;

  constructor() {
    super();

    this._controller = new BaseController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    if (!this._sidejob) {
      return nothing;
    }

    const attributesSkillsTablesClasses = classMap({
      'attributes-skills-tables': true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <div class=${attributesSkillsTablesClasses}>
        <div>
          <h5 class="title">${COMMON_TEXTS.attributes()}</h5>
          <div class="attributes-skills-table">${ATTRIBUTES.map(this.renderRewardsMultplierAttribute)}</div>
        </div>

        <div>
          <h5 class="title">${COMMON_TEXTS.skills()}</h5>
          <div class="attributes-skills-table">${SKILLS.map(this.renderRewardsMultplierSkill)}</div>
        </div>
      </div>
    `;
  }

  private renderRewardsMultplierAttribute = (attribute: Attribute) => {
    const value = this._sidejob!.getAttributeModifier(attribute);

    if (value <= 1) {
      return nothing;
    }

    const existingValue = this._existingSidejob?.getAttributeModifier(attribute) ?? 0;
    const diff = value - existingValue;

    const formatter = this._controller.formatter;

    const formattedValue = formatter.formatNumberFloat(value);
    const formattedDiff = formatter.formatNumberFloat(diff, diffFormatterParameters);

    const classes = getHighlightDifferenceClassMap(diff);
    const diffElement = html`<span class=${classes}>${formattedDiff}</span>`;

    return html`
      <div>${ATTRIBUTE_TEXTS[attribute]()}</div>
      <div>${msg(html`× ${formattedValue} (${diffElement})`)}</div>
    `;
  };

  private renderRewardsMultplierSkill = (skill: Skill) => {
    const value = this._sidejob!.getSkillModifier(skill);

    if (value <= 1) {
      return nothing;
    }

    const existingValue = this._existingSidejob?.getSkillModifier(skill) ?? 0;
    const diff = value - existingValue;

    const formatter = this._controller.formatter;

    const formattedValue = formatter.formatNumberFloat(value);
    const formattedDiff = formatter.formatNumberFloat(diff, diffFormatterParameters);

    const classes = getHighlightDifferenceClassMap(diff);
    const diffElement = html`<span class=${classes}>${formattedDiff}</span>`;

    return html`
      <div>${SKILL_TEXTS[skill]()}</div>
      <div>${msg(html`× ${formattedValue} (${diffElement})`)}</div>
    `;
  };
}
