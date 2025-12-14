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
    padding-bottom: var(--sl-spacing-medium);
  }

  .notification {
    padding: var(--sl-spacing-3x-large);
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
    gap: var(--sl-spacing-medium);
  }
`;

export default styles;
