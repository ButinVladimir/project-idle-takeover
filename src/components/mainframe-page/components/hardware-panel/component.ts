import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { msg, localized } from '@lit/localize';
import { IMainframeHardwareParameter, type MainframeHardwareParameterType } from '@state/mainframe-state';
import { SortableElementMovedEvent } from '@components/shared/sortable-list/events/sortable-element-moved';
import { BaseComponent } from '@shared/index';
import { MainframeHardwarePanelController } from './controller';
import { GAP } from './constants';
import styles from './styles';

@localized()
@customElement('ca-mainframe-hardware-panel')
export class MainframeHardwarePanel extends BaseComponent {
  static styles = styles;

  private _controller: MainframeHardwarePanelController;

  @state()
  private _shiftPressed = false;

  @state()
  private _ctrlPressed = false;

  constructor() {
    super();

    this._controller = new MainframeHardwarePanelController(this);
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('keydown', this.handleKeypress);
    window.addEventListener('keyup', this.handleKeypress);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('keydown', this.handleKeypress);
    window.removeEventListener('keyup', this.handleKeypress);
  }

  protected renderDesktop() {
    return html`
      <p class="hint">
        ${msg(`Press either Ctrl or Shift to buy 10 levels. Press both Ctrl and Shift to buy 100 levels.
Hardware autoupgrade priority can be changed by dragging it by the title.
Upgrades on top have higher priority.`)}
      </p>

      <div class="buttons-block">
        <ca-mainframe-hardware-panel-buttons></ca-mainframe-hardware-panel-buttons>
      </div>

      <ca-sortable-list gap=${GAP} @sortable-element-moved=${this.handleMoveElement}>
        ${repeat(this._controller.listParameters(), (parameter) => parameter.type, this.renderParameter)}
      </ca-sortable-list>
    `;
  }

  private renderParameter = (parameter: IMainframeHardwareParameter) => {
    const increase = this.calculateIncrease();

    return html`
      <ca-mainframe-hardware-panel-article type=${parameter.type} increase=${increase} data-drag-id=${parameter.type}>
      </ca-mainframe-hardware-panel-article>
    `;
  };

  private handleKeypress = (event: KeyboardEvent) => {
    this._shiftPressed = event.shiftKey;
    this._ctrlPressed = event.ctrlKey;
  };

  private calculateIncrease(): number {
    let increase = 1;

    if (this._shiftPressed) {
      increase *= 10;
    }

    if (this._ctrlPressed) {
      increase *= 10;
    }

    return increase;
  }

  private handleMoveElement = (event: SortableElementMovedEvent) => {
    this._controller.moveParameter(event.keyName as MainframeHardwareParameterType, event.position);
  };
}
