import { css } from 'lit';
import { inputLabelStyle } from '@shared/index';

const styles = [
  inputLabelStyle,
  css`
    :host {
      display: contents;
    }

    .filter {
      display: flex;
      flex-direction: column;
      gap: var(--ca-input-row-gap);
      align-items: stretch;
      border-bottom: var(--ca-border);

      .filter-row {
        display: flex;
      }

      &.desktop {
        padding: var(--ca-filter-gap) var(--ca-table-column-gap);

        .filter-row {
          flex-direction: row;
          gap: var(--ca-input-column-gap);
          align-items: stretch;
          justify-content: space-between;

          * {
            flex: 1 0;
          }
        }
      }

      &.mobile {
        padding: var(--ca-filter-gap) 0;

        .filter-row {
          flex-direction: column;
          gap: var(--ca-input-row-gap);
        }
      }
    }
  `,
];

export default styles;
