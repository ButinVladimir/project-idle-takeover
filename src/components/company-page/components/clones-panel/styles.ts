import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: contents;
    }

    .host-content {
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      p.hint {
        margin: 0;
        margin-bottom: var(--ca-section-gap);
      }

      div.top-container {
        display: flex;
        margin-bottom: var(--ca-section-gap);

        .buttons-container {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ca-section-buttons-gap);

          p {
            margin: 0;
          }
        }
      }

      &.mobile div.top-container {
        flex-direction: column-reverse;
        align-items: flex-start;
        gap: var(--ca-section-buttons-gap);
      }

      &.desktop div.top-container {
        flex-direction: row;
        align-items: center;
        gap: var(--ca-section-text-gap);
      }
    }
  `,
];

export default styles;
