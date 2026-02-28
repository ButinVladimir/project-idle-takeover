import { css } from 'lit';
import { itemsListStyle } from '@shared/index';

const styles = [
  itemsListStyle,
  css`
    :host {
      display: contents;
    }

    .items-list .header.desktop {
      grid-template-columns: 3fr 1fr 2fr auto;

      #delete-btn::part(base):hover {
        color: var(--ca-danger-color);
      }
    }
  `,
];

export default styles;
