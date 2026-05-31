import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: var(--ca-section-gap);
    }

    div.buttons {
      display: flex;
      gap: var(--ca-section-buttons-gap);
      flex-wrap: wrap;

      p {
        margin: 0;
      }
    }

    p.hint {
      margin: 0;
    }
  `,
];

export default styles;
