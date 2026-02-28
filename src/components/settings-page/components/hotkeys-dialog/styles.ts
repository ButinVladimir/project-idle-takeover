import { css } from 'lit';
import { hintStyle, sectionTitleStyle, formStyle, smallModalStyle, modalStyle } from '@shared/index';

const styles = [
  hintStyle,
  sectionTitleStyle,
  smallModalStyle,
  modalStyle,
  formStyle,
  css`
    div.buttons-container {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ca-modal-buttons-gap);
    }

    div.hotkey-table {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;
      column-gap: var(--ca-input-column-gap);
      row-gap: var(--ca-input-row-gap);
      align-items: center;
      margin-bottom: var(--ca-modal-section-gap);

      div.hotkey-button-container {
        justify-self: flex-end;
      }
    }

    sl-divider {
      --spacing: 0;
    }
  `,
];

export default styles;
