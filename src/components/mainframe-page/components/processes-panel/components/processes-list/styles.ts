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
    grid-template-rows: auto;
    gap: var(--ca-table-column-gap);
    align-items: center;
    border-bottom: var(--ca-border);

    .header-column {
      font-weight: var(--sl-font-weight-bold);
    }

    .buttons {
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: var(--ca-table-buttons-gap);
    }

    &.mobile {
      grid-template-columns: auto;
      padding: var(--ca-table-column-gap) 0;

      .buttons {
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    }

    &.desktop {
      grid-template-columns: 3fr 1fr 2fr auto;
      padding: var(--ca-table-column-gap);

      .buttons {
        justify-content: flex-end;
        font-size: var(--sl-font-size-large);
      }
    }
  }

  .notification {
    padding: var(--ca-empty-notification-gap);
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

    ca-processes-list-item {
      border-bottom: var(--ca-border);

      &:nth-child(2n + 1) {
        background-color: var(--ca-table-row-odd-color);
      }

      &.dragged {
        background-color: var(--ca-dragged-color);
      }
    }
  }

  #delete-btn::part(base):hover {
    color: var(--sl-color-danger-600);
  }
`;

export default styles;
