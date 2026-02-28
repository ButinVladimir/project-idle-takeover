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
      margin: 0;
      margin-bottom: var(--ca-section-gap);
    }

    div.top-container {
      margin-bottom: var(--ca-section-gap);
    }
  `,
];

export default styles;
