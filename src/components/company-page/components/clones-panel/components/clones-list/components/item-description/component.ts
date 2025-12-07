import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { ATTRIBUTE_TEXTS, COMMON_TEXTS, SKILL_TEXTS } from '@texts/index';
import { Attribute, Skill, ATTRIBUTES, SKILLS, BaseComponent } from '@shared/index';
import { type IClone } from '@state/clones-state';
import { ClonesListItemDescriptionController } from './controller';
import { cloneContext } from '../item/contexts';
import styles from './styles';
import { classMap } from 'lit/directives/class-map.js';

@localized()
@customElement('ca-clones-list-item-description')
export class ClonesListItemAttributes extends BaseComponent {
  static styles = styles;

  protected hasMobileRender = true;

  private _controller: ClonesListItemDescriptionController;

  @consume({ context: cloneContext, subscribe: true })
  private _clone?: IClone;

  constructor() {
    super();

    this._controller = new ClonesListItemDescriptionController(this);
  }

  protected renderMobile() {
    return this.renderContent(false);
  }

  protected renderDesktop() {
    return this.renderContent(true);
  }

  private renderContent(desktop: boolean) {
    if (!this._clone) {
      return nothing;
    }

    const formatter = this._controller.formatter;

    const synchronization = this._controller.getCloneSynchronization(this._clone);
    const formattedSynchronization = formatter.formatNumberDecimal(synchronization);

    const formattedExperienceMultiplier = formatter.formatNumberFloat(this._clone.experienceMultiplier);

    const attributesSkillsTablesClasses = classMap({
      'attributes-skills-tables': true,
      desktop: desktop,
      mobile: !desktop,
    });

    return html`
      <div>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.synchronization(), formattedSynchronization)}</div>
      <div>${COMMON_TEXTS.parameterRow(COMMON_TEXTS.experienceMultiplier(), formattedExperienceMultiplier)}</div>

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
  }

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
}
