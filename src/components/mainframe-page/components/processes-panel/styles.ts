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
      margin-bottom: var(--ca-section-gap);

      &.mobile {
        align-items: flex-start;
        grid-template-areas:
          'ram'
          'cores'
          'start-process';
        gap: var(--ca-section-buttons-gap);
      }

      &.desktop {
        grid-template-areas: 'start-process ram cores';
        align-items: center;
        gap: var(--ca-section-text-gap);
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
    }
  `,
];

export default styles;
