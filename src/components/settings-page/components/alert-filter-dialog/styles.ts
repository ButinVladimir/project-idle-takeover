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

      div.events-container {
        display: grid;
        column-gap: var(--ca-checkbox-list-column-gap);
        row-gap: var(--ca-checkbox-list-row-gap);
        grid-template-rows: auto;
      }

      sl-checkbox.group-checkbox {
        margin-bottom: var(--ca-checkbox-list-group-gap);
      }

      &.mobile div.events-container {
        grid-template-columns: auto;
      }

      &.desktop div.events-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--ca-modal-section-gap);
    }

    sl-divider {
      --spacing: var(--ca-modal-section-gap);
    }
  `,
];

export default styles;
