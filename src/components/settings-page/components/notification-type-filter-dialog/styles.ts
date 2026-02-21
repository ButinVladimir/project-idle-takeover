import { css } from 'lit';
import { hintStyle, sectionTitleStyle, mediumModalStyle, modalBodyScrollStyle, formStyle } from '@shared/index';

const styles = [
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
      margin-bottom: var(--ca-modal-section-gap);
    }

    div.events-container {
      display: grid;
      column-gap: var(--ca-input-column-gap);
      row-gap: var(--ca-input-row-gap);
      grid-template-rows: auto;

      &.mobile {
        grid-template-columns: auto;
      }

      &.desktop {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    sl-divider {
      --spacing: var(--ca-modal-section-gap);
    }
  `,
];

export default styles;
