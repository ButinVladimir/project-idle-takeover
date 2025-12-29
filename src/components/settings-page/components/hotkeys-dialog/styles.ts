import { css } from 'lit';
import { hintStyle, sectionTitleStyle, modalBodyScrollStyle, formStyle, smallModalStyle } from '@shared/index';

const styles = [
  hintStyle,
  sectionTitleStyle,
  smallModalStyle,
  modalBodyScrollStyle,
  formStyle,
  css`
    :host {
      display: contents;
    }

    sl-dialog::part(body) {
      padding-top: 0;
      padding-bottom: 0;
    }

    h4.title {
      margin: 0;
    }

    div.body {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-small);
    }

    div.buttons-container {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-medium);
    }

    div.hotkey-table {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;
      column-gap: var(--sl-spacing-3x-small);
      row-gap: var(--sl-spacing-small);
      align-items: center;
      margin-bottom: var(--sl-spacing-medium);

      div.hotkey-button-container {
        justify-self: flex-end;
      }
    }

    sl-divider {
      --spacing: var(--sl-spacing-medium);
    }
  `,
];

export default styles;
