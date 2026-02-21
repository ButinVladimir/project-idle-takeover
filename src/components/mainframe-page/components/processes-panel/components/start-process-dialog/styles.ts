import { css } from 'lit';
import {
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  mediumModalStyle,
  modalBodyScrollStyle,
  formStyle,
} from '@shared/index';

const styles = [
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  mediumModalStyle,
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

    sl-dialog::part(footer) {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    h4.title {
      margin: 0;
    }

    div.body {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    div.inputs-container {
      display: grid;
      column-gap: var(--ca-input-column-gap);
      row-gap: var(--ca-input-row-gap);
      grid-template-rows: auto;

      &.mobile {
        grid-template-columns: auto;
      }

      &.desktop {
        grid-template-columns: 2fr 1fr;
      }
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--ca-modal-section-gap);
    }
  `,
];

export default styles;
