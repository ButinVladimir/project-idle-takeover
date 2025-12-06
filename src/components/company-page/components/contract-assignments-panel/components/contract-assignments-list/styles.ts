import { css } from 'lit';

const styles = css`
  :host {
    width: 100%;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-top: var(--ca-border);
  }

  .header {
    display: grid;
    gap: var(--sl-spacing-small);
    align-items: center;
    border-bottom: var(--ca-border);

    .buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      flex-direction: row;
      gap: var(--sl-spacing-small);
    }

    &.mobile {
      grid-template-columns: auto;
      grid-template-rows: auto;
      padding: var(--sl-spacing-medium) 0;

      .buttons {
        justify-content: flex-start;
      }
    }

    &.desktop {
      grid-template-columns: 2fr 1fr 1fr 1fr auto;
      grid-template-rows: auto;
      padding: var(--sl-spacing-small);

      .header-column {
        font-weight: var(--sl-font-weight-bold);
      }

      .buttons {
        justify-content: flex-end;
        font-size: var(--sl-font-size-large);
      }
    }
  }

  .notification {
    padding: var(--sl-spacing-3x-large);
    text-align: center;
    border-bottom: var(--ca-border);
  }

  ca-contracts-list-item {
    &:nth-child(2n) {
      background-color: var(--ca-table-row-odd-color);
    }
  }
`;

export default styles;
