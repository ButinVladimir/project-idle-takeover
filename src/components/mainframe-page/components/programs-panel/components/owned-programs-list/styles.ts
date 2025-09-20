import { css } from 'lit';

const styles = css`
  :host {
    width: 100%;
    align-self: stretch;
    display: block;
    border-top: var(--ca-border);
  }

  .header {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    gap: var(--sl-spacing-small);
    align-items: center;
    border-bottom: var(--ca-border);

    .header-column {
      font-weight: var(--sl-font-weight-bold);
    }

    &.desktop {
      grid-template-columns: 2fr 1fr 1fr auto;
      padding: var(--sl-spacing-small);
    }

    &.mobile {
      grid-template-columns: auto;
      padding: var(--sl-spacing-medium) 0;
    }
  }

  .notification {
    padding: var(--sl-spacing-3x-large);
    text-align: center;
    border-bottom: var(--ca-border);
  }

  ca-sortable-list {
    width: 100%;

    &::part(list) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
    }

    ca-owned-programs-list-item {
      border-bottom: var(--ca-border);

      &:nth-child(2n + 1) {
        background-color: var(--ca-table-row-odd-color);
      }

      &.dragged {
        background-color: var(--ca-dragged-color);
      }
    }
  }
`;

export default styles;
