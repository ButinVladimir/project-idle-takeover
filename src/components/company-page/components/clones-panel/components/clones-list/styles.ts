import { css } from 'lit';

const styles = css`
  :host {
    width: 100%;
    align-self: stretch;
    display: block;
    border-top: var(--ca-border);
  }

  .header-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: var(--ca-panel-column-gap) 0;
    gap: var(--ca-panel-column-gap);

    &.with-border {
      border-bottom: var(--ca-border);
    }
  }

  .notification {
    padding: var(--ca-empty-notification-gap);
    text-align: center;
    border-top: var(--ca-border);
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
      gap: var(--ca-table-row-gap);
    }
  }
`;

export default styles;
