import { html } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent, GameStateAlert } from '@shared/index';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { COMMON_TEXTS } from '@texts/index';
import { SavefilePanelController } from './controller';
import styles from './styles';

@localized()
@customElement('ca-savefile-panel')
export class SavefilePanel extends BaseComponent {
  static styles = styles;

  private _controller: SavefilePanelController;

  private _importInputRef = createRef<HTMLInputElement>();

  constructor() {
    super();

    this._controller = new SavefilePanelController(this);
  }

  protected renderDesktop() {
    return html`
      <input ${ref(this._importInputRef)} type="file" id="import-file" @change=${this.handleChangeImportSavefile} />

      <sl-tooltip>
        <span slot="content">${COMMON_TEXTS.hotkey(this._controller.getSaveGameHotkey())}</span>

        <sl-button variant="primary" type="button" size="medium" @click=${this.handleSaveGame}>
          ${msg('Save game')}
        </sl-button>
      </sl-tooltip>

      <sl-button variant="default" type="button" size="medium" @click=${this.handleOpenImportSavefileDialog}>
        ${msg('Import savefile')}
      </sl-button>

      <sl-button variant="default" type="button" size="medium" @click=${this.handleExportSavefile}>
        ${msg('Export savefile')}
      </sl-button>

      <sl-button variant="danger" type="button" size="medium" @click=${this.handleOpenDeleteSaveDataDialog}>
        ${msg('Delete save data')}
      </sl-button>

      <sl-button
        variant="default"
        type="button"
        size="medium"
        outline
        @click=${this.handleOpenRestoreDefaultSettingsDialog}
      >
        ${msg('Restore default settings')}
      </sl-button>
    `;
  }

  private handleSaveGame = () => {
    this._controller.saveGame();
  };

  private handleOpenImportSavefileDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.saveImport,
        msg('Are you sure want to import savefile? Your current progress will be lost.'),
        this.hanldeImportSavefile,
      ),
    );
  };

  private hanldeImportSavefile = () => {
    if (this._importInputRef.value) {
      this._importInputRef.value.click();
    }
  };

  private handleChangeImportSavefile = () => {
    if (!this._importInputRef.value) {
      return;
    }

    const importedSavefile = this._importInputRef.value.files?.item(0);

    if (importedSavefile) {
      this._controller.importSavefile(importedSavefile);
    }
  };

  private handleExportSavefile = () => {
    this._controller.exportSavefile();
  };

  private handleOpenDeleteSaveDataDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.saveDelete,
        msg('Are you sure want to delete save data? Your current progress will be lost.'),
        this.handleDeleteSaveData,
      ),
    );
  };

  private handleDeleteSaveData = () => {
    this._controller.deleteSaveData().catch((e) => {
      console.error(e);
    });
  };

  private handleOpenRestoreDefaultSettingsDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.restoreDefaultSettings,
        msg('Are you sure want to restore default settings?'),
        this.handleRestoreDefaultSettings,
      ),
    );
  };

  private handleRestoreDefaultSettings = () => {
    this._controller.restoreDefaultSettings().catch((e) => {
      console.error(e);
    });
  };
}
