import { css } from 'lit';
import { dragIconStyle } from '@shared/index';

const styles = [
  dragIconStyle,
  css`
    :host {
      display: block;
    }

    .host-content {
      display: grid;
      gap: var(--sl-spacing-small);
      padding: var(--sl-spacing-small);
      box-sizing: border-box;
      border-bottom: var(--ca-border);

      .contract-title {
        cursor: grab;

        sl-icon-button.description-button {
          position: relative;
          top: 0.25rem;
        }
      }

      .contract-assignment-description {
        box-sizing: border-box;
        height: 0;
        overflow: hidden;
        color: var(--ca-hint-color);
        font-size: var(--ca-hint-font-size);
        line-height: var(--ca-hint-line-height);

        &.visible {
          height: auto;
          padding-top: var(--sl-spacing-medium);
        }
      }

      .buttons {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: var(--sl-spacing-small);
      }

      &.desktop {
        grid-template-columns: 2fr 1fr 1fr 1fr auto;
        grid-template-rows: auto;
        align-items: center;

        .clones p {
          margin: 0;
        }

        .buttons {
          justify-content: flex-end;
          font-size: var(--sl-font-size-large);
        }

        #cancel-btn::part(base):hover {
          color: var(--sl-color-danger-600);
        }
      }

      &.mobile {
        grid-template-columns: auto;
        grid-template-rows: repeat(1fr);

        .buttons {
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
    }
  `,
];

export default styles;
