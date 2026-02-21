import { css } from 'lit';

const styles = css`
  :host {
    display: contents;
  }

  .buttons {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--ca-table-buttons-gap);

    &.desktop {
      justify-content: flex-end;
      font-size: var(--sl-font-size-large);
    }

    &.mobile {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }

  .tooltip-content p {
    margin: 0;
  }
`;

export default styles;
