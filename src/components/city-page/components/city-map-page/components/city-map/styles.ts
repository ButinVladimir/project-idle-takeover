import { css } from 'lit';

const cityMapStyles = css`
  :host {
    display: block;
    width: 100%;
  }

  .host-content {
    display: flex;
    gap: var(--ca-section-gap);
    width: 100%;

    div.content {
      position: relative;
      cursor: not-allowed;

      &.unlocked {
        cursor: pointer;
      }
    }

    ca-city-map-district {
      opacity: 0;

      &.visible {
        opacity: 1;
      }
    }
  }

  .host-content.mobile {
    flex-direction: column;
  }

  .host-content.desktop {
    flex-direction: row;
  }
`;

export default cityMapStyles;
