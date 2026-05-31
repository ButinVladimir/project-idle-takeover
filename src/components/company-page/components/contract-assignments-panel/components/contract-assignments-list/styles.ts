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
    }
  `,
];

export default styles;
