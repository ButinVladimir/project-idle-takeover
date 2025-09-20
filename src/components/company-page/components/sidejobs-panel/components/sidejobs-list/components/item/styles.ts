import { css } from 'lit';

const styles = [
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

      .sidejob-title sl-icon-button.description-button {
        position: relative;
        top: 0.25rem;
      }

      .sidejob-description {
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

      &.desktop {
        grid-template-columns: 1fr 1fr 2fr auto;
        grid-template-rows: auto;
        align-items: center;

        .buttons {
          font-size: var(--sl-font-size-large);
        }

        #cancel-btn::part(base):hover {
          color: var(--sl-color-danger-600);
        }
      }

      &.mobile {
        grid-template-columns: auto;
        grid-template-rows: repeat(1fr);
      }
    }
  `,
];

export default styles;
