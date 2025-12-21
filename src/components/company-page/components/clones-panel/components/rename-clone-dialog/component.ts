import { html, nothing } from 'lit';
import { consume } from '@lit/context';
import { localized, msg, str } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { BaseComponent } from '@shared/index';
import { type IClone } from '@state/clones-state';
import { COMMON_TEXTS } from '@texts/index';
import { RenameCloneDialogController } from './controller';
import { CloseCloneListItemDialogEvent } from '../../events/close-clone-list-item-dialog';
import { modalCloneContext } from '../../contexts';
import styles from './styles';

@localized()
@customElement('ca-rename-clone-dialog')
export class RenameCloneDialog extends BaseComponent {
  static styles = styles;

  private _controller: RenameCloneDialogController;

  @property({
    attribute: 'open',
    type: Boolean,
  })
  open = false;

  @state()
  private _newName = '';

  @consume({ context: modalCloneContext, subscribe: true })
  private _clone?: IClone;

  private _newNameInputRef = createRef<SlInput>();

  constructor() {
    super();

    this._controller = new RenameCloneDialogController(this);
  }

  updated(_changedProperties: Map<string, any>) {
    super.updated(_changedProperties);

    if (_changedProperties.has('open') && this._clone) {
      this._newName = this._clone.name ?? '';
    }
  }

  renderDesktop() {
    if (!this._clone) {
      return nothing;
    }

    const warning = this.getWarning();

    return html`
      <form id="rename-clone-dialog" @submit=${this.handleSubmit}>
        <sl-dialog ?open=${this.open} @sl-request-close=${this.handleClose}>
          <h4 slot="label" class="title">${msg(str`Rename clone "${this._clone.name}"`)}</h4>

          <div class="body">
            <p class="hint">${msg(str`Enter new name for clone.`)}</p>

            <sl-input
              ${ref(this._newNameInputRef)}
              name="newName"
              value=${this._newName}
              autocomplete="off"
              @sl-change=${this.handleNewNameChange}
            >
              <span class="input-label" slot="label"> ${msg('New name')} </span>

              <sl-icon-button
                slot="suffix"
                label=${msg('Generate name')}
                name="dice-4"
                @click=${this.handleGenerateName}
              >
              </sl-icon-button>
            </sl-input>
          </div>

          <div slot="footer" class="footer">
            <p class="warning">${warning}</p>

            <div class="buttons">
              <sl-button size="medium" variant="default" @click=${this.handleClose}>
                ${COMMON_TEXTS.cancel()}
              </sl-button>

              <sl-button ?disabled=${!this._newName} type="submit" size="medium" variant="primary">
                ${COMMON_TEXTS.continue()}
              </sl-button>
            </div>
          </div>
        </sl-dialog>
      </form>
    `;
  }

  private getWarning(): string {
    if (!this._newName) {
      return msg('Enter new name');
    }

    return '';
  }

  private handleClose = () => {
    this.dispatchEvent(new CloseCloneListItemDialogEvent());
  };

  private handleNewNameChange = () => {
    if (!this._newNameInputRef.value) {
      return;
    }

    this._newName = this._newNameInputRef.value.value;
  };

  private handleGenerateName = () => {
    this._newName = this._controller.generateName();
  };

  private handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this._newName) {
      return;
    }

    this._controller.renameCloneById(this._clone!.id, this._newName);
    this.dispatchEvent(new CloseCloneListItemDialogEvent());
  };
}
