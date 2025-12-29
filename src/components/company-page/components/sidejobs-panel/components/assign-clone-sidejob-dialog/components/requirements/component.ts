import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ATTRIBUTE_TEXTS, COMMON_TEXTS, SKILL_TEXTS } from '@texts/index';
import { type ISidejob } from '@state/activity-state';
import { BaseComponent, Attribute, ATTRIBUTES, getHighlightValueClassMap, Skill, SKILLS } from '@shared/index';
import { temporarySidejobContext } from '../../contexts';
import styles from './styles';
import { AssignCloneSidejobDialogRequirementsController } from './controller';

@localized()
@customElement('ca-assign-clone-sidejob-dialog-requirements')
export class AssignCloneSidejobDialogRequirements extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;

  private _controller: AssignCloneSidejobDialogRequirementsController;

  @consume({ context: temporarySidejobContext, subscribe: true })
  private _sidejob?: ISidejob;

  constructor() {
    super();

    this._controller = new AssignCloneSidejobDialogRequirementsController(this);
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
          <div class="attributes-skills-table">${ATTRIBUTES.map(this.renderRequirementAttribute)}</div>
        </div>

        <div>
          <h5 class="title">${COMMON_TEXTS.skills()}</h5>
          <div class="attributes-skills-table">${SKILLS.map(this.renderRequirementSkill)}</div>
        </div>
      </div>
    `;
  }

  private renderRequirementAttribute = (attribute: Attribute) => {
    const requiredValue = this._sidejob!.getAttributeRequirement(attribute);

    if (requiredValue <= 0) {
      return nothing;
    }

    const availableValue = this._sidejob?.assignedClone?.getTotalAttributeValue(attribute) ?? 0;

    const formatter = this._controller.formatter;

    const formattedAvailableValue = formatter.formatNumberDecimal(availableValue);
    const formattedRequiredValue = formatter.formatNumberDecimal(requiredValue);

    const valid = this._controller.validateAttribute(this._sidejob!, attribute);

    const classes = getHighlightValueClassMap(valid);

    return html`
      <div>${ATTRIBUTE_TEXTS[attribute]()}</div>
      <div class=${classes}>${formattedAvailableValue} / ${formattedRequiredValue}</div>
    `;
  };

  private renderRequirementSkill = (skill: Skill) => {
    const requiredValue = this._sidejob!.getSkillRequirement(skill);

    if (requiredValue <= 0) {
      return nothing;
    }

    const availableValue = this._sidejob?.assignedClone?.getTotalSkillValue(skill) ?? 0;

    const formatter = this._controller.formatter;

    const formattedAvailableValue = formatter.formatNumberDecimal(availableValue);
    const formattedRequiredValue = formatter.formatNumberDecimal(requiredValue);

    const valid = this._controller.validateSkill(this._sidejob!, skill);

    const classes = getHighlightValueClassMap(valid);

    return html`
      <div>${SKILL_TEXTS[skill]()}</div>
      <div class=${classes}>${formattedAvailableValue} / ${formattedRequiredValue}</div>
    `;
  };
}
