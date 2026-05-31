import { css } from 'lit';
import { pageTitleStyle } from '@shared/index';

const styles = [
  pageTitleStyle,
  css`
    :host {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    sl-divider {
      --spacing: var(--ca-section-gap);
    }
  `,
];

export default styles;
