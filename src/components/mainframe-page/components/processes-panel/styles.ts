import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--ca-section-gap);
    }

    div.top-container {
      display: grid;

      &.mobile {
        align-items: flex-start;
        grid-template-areas:
          'ram'
          'cores'
          'start-process';
        gap: var(--sl-spacing-medium);
      }

      &.desktop {
        grid-template-areas: 'start-process ram cores';
        align-items: center;
        gap: var(--sl-spacing-3x-large);
      }
    }

    .start-process {
      grid-area: start-process;
    }

    .cores {
      grid-area: cores;
    }

    .ram {
      grid-area: ram;
    }

    ca-processes-list {
      margin-top: var(--ca-section-gap);
    }
  `,
];

export default styles;
