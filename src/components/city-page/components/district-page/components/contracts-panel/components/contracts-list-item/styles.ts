import { css } from 'lit';
import { hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  css`
    .host-content {
      width: 100%;
      display: flex;
      gap: var(--ca-table-column-gap);
      padding: var(--ca-table-column-gap);
      box-sizing: border-box;

      p.title {
        margin: 0;
      }

      &.mobile {
        flex-direction: column;
        align-items: stretch;
      }

      &.desktop {
        flex-direction: row;
        align-items: center;

        div.contract {
          flex: 2;
        }

        div.available {
          flex: 1;
        }

        div.generation {
          flex: 3;
        }
      }
    }
  `,
];

export default styles;
