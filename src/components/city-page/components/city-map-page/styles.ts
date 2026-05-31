import { css } from 'lit';
import { hintStyle, pageTitleStyle } from '@shared/index';

const cityMapPageStyles = [
  pageTitleStyle,
  hintStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      position: relative;
    }

    p.hint {
      margin-bottom: var(--ca-section-gap);
    }

    div.content {
      width: 100%;
    }
  `,
];

export default cityMapPageStyles;
