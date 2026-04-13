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
    padding: var(--ca-section-padding) 0;
    gap: var(--ca-section-buttons-gap);
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
    gap: var(--ca-panel-row-gap);
  }
`;

export default styles;
