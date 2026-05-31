import { css } from 'lit';
import { formStyle, inputLabelStyle } from '@shared/styles';

const styles = [
  inputLabelStyle,
  formStyle,
  css`
    :host {
      display: block;
      width: 100%;
    }

    div.spinner-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--ca-empty-notification-gap);
      font-size: var(--sl-font-size-3x-large);
    }

    div.settings-form {
      width: 100%;
      display: grid;
      grid-template-rows: auto;
      grid-template-rows: auto;
      align-items: flex-start;
      margin-bottom: var(--ca-section-gap);

      &.mobile {
        row-gap: var(--ca-input-row-gap);
        grid-template-columns: 1fr;
      }

      &.desktop {
        row-gap: var(--ca-input-row-gap);
        column-gap: var(--ca-input-column-gap);
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
];

export default styles;
