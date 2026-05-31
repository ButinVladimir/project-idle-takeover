import { css } from 'lit';
import { pageTitleStyle } from '@shared/index';

const styles = [
  pageTitleStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    sl-divider {
      --spacing: var(--ca-section-gap);
    }
  `,
];

export default styles;
