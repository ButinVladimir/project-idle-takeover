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
      margin-bottom: var(--ca-section-gap);
    }

    .header {
      display: flex;
      gap: var(--ca-table-column-gap);
      align-items: center;
      border-bottom: var(--ca-border);
      padding: var(--ca-table-column-gap);

      .header-column {
        display: block;
        font-weight: var(--sl-font-weight-bold);

        &.column-sidejob {
          flex: 1;
        }

        &.column-progress {
          flex: 2;
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

      ca-city-district-sidejobs-list-item {
        border-bottom: var(--ca-border);

        &:nth-child(2n) {
          background-color: var(--ca-table-row-odd-color);
        }
      }
    }
  `,
];

export default styles;
