import { css } from 'lit';
import { warningStyle } from '@shared/index';

const styles = [
  warningStyle,
  css`
    :host {
      display: contents;
    }

    .host-content {
      display: block;

      p.warning {
        margin-top: var(--sl-spacing-3x-small);
        margin-bottom: 0;
        display: none;

        &.visible {
          display: block;
        }
      }

      div.buttons {
        display: flex;
        gap: var(--sl-spacing-medium);
      }

      &.mobile {
        p.warning {
          text-align: left;
        }

        div.buttons {
          justify-content: flex-start;
        }
      }

      &.desktop {
        p.warning {
          text-align: right;
        }

        div.buttons {
          justify-content: flex-end;
        }
      }
    }
  `,
];

export default styles;
