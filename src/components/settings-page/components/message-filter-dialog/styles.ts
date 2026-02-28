import { css } from 'lit';
import { hintStyle, sectionTitleStyle, mediumModalStyle, formStyle, modalStyle } from '@shared/index';

const styles = [
  hintStyle,
  sectionTitleStyle,
  mediumModalStyle,
  modalStyle,
  formStyle,
  css`
    div.body {
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

    sl-divider {
      --spacing: 0;
    }
  `,
];

export default styles;
