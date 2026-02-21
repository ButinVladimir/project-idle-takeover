import { css } from 'lit';

const styles = css`
  :host {
    width: 100%;
    align-self: stretch;
    display: block;
  }

  .header-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-bottom: var(--ca-section-gap);
  }

  .notification {
    padding: var(--ca-empty-notification-gap);
    text-align: center;
    border-top: var(--ca-border);
    border-bottom: var(--ca-border);
  }

  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: var(--ca-table-row-gap);
  }
`;

export default styles;
