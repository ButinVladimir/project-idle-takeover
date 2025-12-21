import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: block;
      width: 100%;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-large);
    }

    .header {
      display: flex;
      gap: var(--sl-spacing-small);
      align-items: center;
      border-bottom: var(--ca-border);
      padding: var(--sl-spacing-small);

      .header-column {
        display: block;
        font-weight: var(--sl-font-weight-bold);

        &.column-contract {
          flex: 2;
        }

        &.column-available {
          flex: 1;
        }

        &.column-generation {
          flex: 3;
        }
      }
    }

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      border-top: var(--ca-border);

      ca-city-district-contracts-list-item {
        border-bottom: var(--ca-border);

        &:nth-child(2n) {
          background-color: var(--ca-table-row-odd-color);
        }
      }
    }
  `,
];

export default styles;
