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
      }

      &.mobile div.top-container {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--ca-panel-row-gap);
      }

      &.desktop div.top-container {
        flex-direction: row;
        align-items: center;
        gap: var(--ca-panel-column-gap);
      }
    }
  `,
];

export default styles;
