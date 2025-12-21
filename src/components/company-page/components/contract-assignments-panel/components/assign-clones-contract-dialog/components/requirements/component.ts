import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ATTRIBUTE_TEXTS, COMMON_TEXTS, SKILL_TEXTS } from '@texts/index';
import { type IContract } from '@state/activity-state';
import { BaseComponent, Attribute, ATTRIBUTES, getHighlightValueClassMap, Skill, SKILLS } from '@shared/index';
import { temporaryContractContext } from '../../contexts';
import styles from './styles';
import { AssignClonesContractDialogRequirementsController } from './controller';

@localized()
@customElement('ca-assign-clones-contract-dialog-requirements')
export class AssignClonesContractDialogRequirements extends BaseComponent {
  static styles = styles;

  hasMobileRender = true;

  private _controller: AssignClonesContractDialogRequirementsController;

  @consume({ context: temporaryContractContext, subscribe: true })
  private _contract?: IContract;

  constructor() {
    super();

    this._controller = new AssignClonesContractDialogRequirementsController(this);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  private renderContent(desktop: boolean) {
    if (!this._contract) {
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
    const requiredValue = this._contract!.getAttributeRequirement(attribute);

    if (requiredValue <= 0) {
      return nothing;
    }

    const validTeamSize = this._controller.getAttributeValidTeamSize(this._contract!, attribute);
    const requiredTeamSize = this._contract!.getAttributeRequiredTeamSize(attribute);

    const formatter = this._controller.formatter;

    const formattedValidTeamSize = formatter.formatNumberDecimal(validTeamSize);
    const formattedRequiredTeamSize = formatter.formatNumberDecimal(requiredTeamSize);
    const formattedRequiredValue = formatter.formatNumberDecimal(requiredValue);

    const valid = this._controller.validateAttribute(this._contract!, attribute);

    const classes = getHighlightValueClassMap(valid);

    return html`
      <div>${ATTRIBUTE_TEXTS[attribute]()}</div>
      <div class=${classes}>
        ${msg(str`${formattedValidTeamSize} / ${formattedRequiredTeamSize} of ${formattedRequiredValue}`)}
      </div>
    `;
  };

  private renderRequirementSkill = (skill: Skill) => {
    const requiredValue = this._contract!.getSkillRequirement(skill);

    if (requiredValue <= 0) {
      return nothing;
    }

    const validTeamSize = this._controller.getSkillValidTeamSize(this._contract!, skill);
    const requiredTeamSize = this._contract!.getSkillRequiredTeamSize(skill);

    const formatter = this._controller.formatter;

    const formattedValidTeamSize = formatter.formatNumberDecimal(validTeamSize);
    const formattedRequiredTeamSize = formatter.formatNumberDecimal(requiredTeamSize);
    const formattedRequiredValue = formatter.formatNumberDecimal(requiredValue);

    const valid = this._controller.validateSkill(this._contract!, skill);

    const classes = getHighlightValueClassMap(valid);

    return html`
      <div>${SKILL_TEXTS[skill]()}</div>
      <div class=${classes}>
        ${msg(str`${formattedValidTeamSize} / ${formattedRequiredTeamSize} of ${formattedRequiredValue}`)}
      </div>
    `;
  };
}
