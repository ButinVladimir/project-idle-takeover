import { css } from 'lit';
import { hintIconStyle, itemsListItemStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  itemsListItemStyle,
  css`
    :host {
      display: block;
    }

    .items-list-item.desktop {
      grid-template-columns: 2fr 1fr 3fr;
    }
  `,
];

export default styles;
