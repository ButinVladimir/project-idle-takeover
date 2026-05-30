import { css } from 'lit';

const styles = [
  css`
    :host {
      display: flex;
      gap: var(--ca-section-buttons-gap);
      flex-wrap: wrap;
    }

    .hotkeys-content p {
      margin: 0;
    }
  `,
];

export default styles;
