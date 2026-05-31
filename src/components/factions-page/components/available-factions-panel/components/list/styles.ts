import { css } from 'lit';
import { hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  css`
    :host {
      display: contents;
    }

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      border-top: var(--ca-border);

      .header {
        display: block;
        border-bottom: var(--ca-border);
        font-weight: var(--sl-font-weight-bold);
      }

      ca-factions-available-factions-list-item:nth-child(2n)::part(base) {
        background-color: var(--ca-table-row-odd-color);
      }

      &.desktop .header {
        padding: var(--ca-table-column-gap);
      }

      &.mobile .header {
        padding: var(--ca-table-column-gap) 0;
      }
    }

    .notification {
      padding: var(--ca-empty-notification-gap);
      text-align: center;
      border-bottom: var(--ca-border);
    }
  `,
];

export default styles;
