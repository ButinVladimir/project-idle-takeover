import { html } from 'lit';
import { msg, localized } from '@lit/localize';
import { customElement, state } from 'lit/decorators.js';
import { BaseComponent } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-company-sidejobs-panel')
export class CompanySidejobsPanel extends BaseComponent {
  static styles = styles;

  @state()
  private _assignCloneDialogOpened = false;

  protected renderDesktop() {
    return html`
      <p class="hint">
        ${msg(`Clones work on sidejobs to provide passive income when they're not working on primary activities.
Only one sidejob can be assigned per clone at same time.`)}
      </p>

      <div class="top-container">
        <sl-button
          class="assign-clone"
          variant="primary"
          size="medium"
          @click=${this.handleAssignCloneSidejobDialogOpen}
        >
          ${msg('Assign clones to sidejobs')}
        </sl-button>
      </div>

      <ca-sidejobs-list></ca-sidejobs-list>

      <ca-assign-clone-sidejob-dialog
        ?open=${this._assignCloneDialogOpened}
        @assign-clone-sidejob-dialog-close=${this.handleAssignCloneSidejobDialogClose}
      >
      </ca-assign-clone-sidejob-dialog>
    `;
  }

  private handleAssignCloneSidejobDialogOpen = () => {
    this._assignCloneDialogOpened = true;
  };

  private handleAssignCloneSidejobDialogClose = () => {
    this._assignCloneDialogOpened = false;
  };
}
