import { css } from 'lit';
import { dragIconStyle, hintIconStyle, itemsListItemStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  dragIconStyle,
  itemsListItemStyle,
  css`
    :host {
      display: block;
    }

    .items-list-item {
      &.desktop {
        grid-template-columns: 2fr 1fr 1fr auto;
      }
    }
  `,
];

export default styles;
