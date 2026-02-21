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

    p.hint {
      margin: 0;
    }
  `,
];

export default styles;
