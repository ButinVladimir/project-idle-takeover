import { css } from 'lit';

const styles = css`
  :host {
    display: block;
  }

  div.log-content {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--sl-spacing-3x-small);
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export default styles;
