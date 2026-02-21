import { css } from 'lit';

export const progressBlockStyle = css`
  div.block div.title {
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
    margin-bottom: var(--sl-spacing-2x-small);
  }

  div.block sl-progress-bar {
    --height: var(--sl-spacing-2x-large);
  }

  div.block sl-progress-bar::part(label) {
    font-size: var(--sl-font-size-medium);
  }
`;

const styles = css`
  :host {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    gap: var(--ca-section-gap);
  }
`;

export default styles;
