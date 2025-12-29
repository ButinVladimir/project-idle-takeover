import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: block;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-large);
    }
  `,
];

export default styles;
