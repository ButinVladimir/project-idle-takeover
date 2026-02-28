import { css } from 'lit';
import { itemsListStyle } from '@shared/index';

const styles = [
  itemsListStyle,
  css`
    :host {
      display: contents;
    }

    .items-list .header.desktop {
      grid-template-columns: 2fr 1fr 1fr 1fr auto;

      .tooltip-content p {
        margin: 0;
      }

      #delete-btn::part(base):hover {
        color: var(--ca-danger-color);
      }
    }
  `,
];

export default styles;
