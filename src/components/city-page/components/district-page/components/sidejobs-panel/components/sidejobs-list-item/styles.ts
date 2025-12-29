import { css } from 'lit';
import { hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  css`
    .host-content {
      width: 100%;
      display: flex;
      gap: var(--sl-spacing-small);
      padding: var(--sl-spacing-small);
      box-sizing: border-box;

      p.title {
        margin: 0;
      }

      &.mobile {
        flex-direction: column;
        align-items: stretch;
      }

      &.desktop {
        flex-direction: row;
        align-items: center;

        div.sidejob {
          flex: 1;
        }

        div.progress-bar {
          flex: 2;
        }
      }
    }
  `,
];

export default styles;
