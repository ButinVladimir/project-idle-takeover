import { css } from 'lit';
import { hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  css`
    :host {
      display: contents;
    }

    .list-item {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto;
      border-bottom: var(--ca-border);
      gap: var(--ca-table-column-gap);
      align-items: center;

      .header-column {
        font-weight: var(--sl-font-weight-bold);
      }

      &:nth-child(2n) {
        background-color: var(--ca-table-row-odd-color);
      }

      &.desktop {
        grid-template-columns: 1fr auto;
        padding: var(--ca-table-column-gap);
      }

      &.mobile {
        grid-template-columns: auto;
        padding: var(--ca-table-column-gap) 0;
      }
    }
  `,
];

export default styles;
