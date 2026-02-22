import { css } from 'lit';
import { pageTitleStyle } from '@shared/styles';

const cityDistrictPageStyles = [
  pageTitleStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      position: relative;
    }

    h3.title {
      margin: 0;
    }

    div.title {
      display: flex;
      align-items: center;
      margin-top: calc(-1 * var(--sl-spacing-2x-small));
      margin-bottom: var(--ca-page-title-gap);
    }

    sl-icon-button.go-back-btn {
      font-size: var(--sl-font-size-2x-large);
      position: relative;
      margin-left: -1rem;
    }
  `,
];

export default cityDistrictPageStyles;
