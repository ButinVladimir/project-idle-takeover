import { css } from 'lit';
import { smallModalStyle, modalBodyScrollStyle, formStyle } from '@shared/index';

const styles = [
  smallModalStyle,
  modalBodyScrollStyle,
  formStyle,
  css`
    :host {
      display: contents;
    }

    sl-dialog::part(footer) {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--sl-spacing-small);
    }

    p {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-large);
    }
  `,
];

export default styles;
