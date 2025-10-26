import { html, nothing } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent, capitalizeFirstLetter, type Faction, Feature, MapSpecialEvent } from '@shared/index';
import { ProgramName } from '@state/mainframe-state';
import { UNLOCKED_FEATURE_TEXTS, STORY_MESSAGES, SPECIAL_EVENTS_MESSAGES, FACTION_TEXTS } from '@texts/index';
import { KEYS_SEPARATOR } from '../../../../constants';
import styles from './styles';
import { OverviewStoryGoalController } from './controller';

@localized()
@customElement('ca-overview-story-goal')
export class OverviewStoryGoal extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'name',
    type: String,
  })
  name!: string;

  @property({
    attribute: 'level',
    type: Number,
  })
  level?: number;

  @property({
    attribute: 'faction',
    type: String,
  })
  faction?: Faction;

  @property({
    attribute: 'captured-districts-count',
    type: Number,
  })
  capturedDistrictsCount?: number;

  @property({
    attribute: 'messages',
    type: String,
  })
  messages?: string;

  @property({
    attribute: 'special-events',
    type: String,
  })
  specialEvents?: string;

  @property({
    attribute: 'unlock-features',
    type: String,
  })
  unlockFeatures?: string;

  @property({
    attribute: 'programs',
    type: String,
  })
  programs?: string;

  @property({
    attribute: 'clone-templates',
    type: String,
  })
  cloneTemplates?: string;

  @property({
    attribute: 'sidejobs',
    type: String,
  })
  sidejobs?: string;

  private _controller: OverviewStoryGoalController;

  constructor() {
    super();

    this._controller = new OverviewStoryGoalController(this);
  }

  protected renderDesktop() {
    const disabled = !this._controller.isStoryEventUnlocked(this.name);

    return html`
      <sl-details ?disabled=${disabled}>
        <h4 class="title" slot="summary">${this.renderSummary()}</h4>

        <article>${this.renderDetails()}</article>
      </sl-details>
    `;
  }

  private renderSummary = () => {
    const requirements = [];

    if (this.level !== undefined) {
      const formattedLevel = this._controller.formatter.formatLevel(this.level);

      requirements.push(msg(str`reached development level ${formattedLevel}`));
    }

    if (this.faction !== undefined) {
      requirements.push(msg(str`joined ${FACTION_TEXTS[this.faction].title()}`));
    }

    if (this.capturedDistrictsCount !== undefined) {
      const formattedCount = this._controller.formatter.formatNumberDecimal(this.capturedDistrictsCount);

      requirements.push(msg(str`${formattedCount} captured districts`));
    }

    const result = capitalizeFirstLetter(requirements.join(', '));

    return result;
  };

  private renderDetails = () => {
    if (!this._controller.isStoryEventUnlocked(this.name)) {
      return nothing;
    }

    const result = [
      ...this.renderMessages(),
      ...this.renderUnlockFeatures(),
      ...this.renderSpecialEvents(),
      ...this.renderPrograms(),
      ...this.renderCloneTemplates(),
      ...this.renderSidejobs(),
    ];

    return result;
  };

  private renderMessages = () => {
    if (!this.messages) {
      return [];
    }

    return this.messages.split(KEYS_SEPARATOR).map((message) => html`<p>${STORY_MESSAGES[message]()}</p>`);
  };

  private renderUnlockFeatures = () => {
    if (!this.unlockFeatures) {
      return [];
    }

    return this.unlockFeatures
      .split(KEYS_SEPARATOR)
      .map((feature) => html`<p>${UNLOCKED_FEATURE_TEXTS[feature as Feature].message()}</p>`);
  };

  private renderSpecialEvents = () => {
    if (!this.specialEvents) {
      return [];
    }

    return this.specialEvents
      .split(KEYS_SEPARATOR)
      .map((specialEvent) => html`<p>${SPECIAL_EVENTS_MESSAGES[specialEvent as MapSpecialEvent]()}</p>`);
  };

  private renderPrograms = () => {
    if (!this.programs) {
      return [];
    }

    return this.programs
      .split(KEYS_SEPARATOR)
      .map((programName) => html`<p>${this._controller.makeProgramUnlockMessage(programName as ProgramName)}</p>`);
  };

  private renderCloneTemplates = () => {
    if (!this.cloneTemplates) {
      return [];
    }

    return this.cloneTemplates
      .split(KEYS_SEPARATOR)
      .map((cloneTemplateName) => html`<p>${this._controller.makeCloneTemplateUnlockMessage(cloneTemplateName)}</p>`);
  };

  private renderSidejobs = () => {
    if (!this.sidejobs) {
      return [];
    }

    return this.sidejobs
      .split(KEYS_SEPARATOR)
      .map((sidejobName) => html`<p>${this._controller.makeSidejobUnlockMessage(sidejobName)}</p>`);
  };
}
