import { css } from 'lit';
import { itemsListItemButtonsStyle, itemsListItemStyle } from '@shared/index';

const styles = [
  itemsListItemStyle,
  itemsListItemButtonsStyle,
  css`
    :host {
      display: block;
    }

    .items-list-item.desktop {
      grid-template-columns: 2fr 1fr 1fr 1fr auto;

      #delete-btn::part(base):hover {
        color: var(--ca-danger-color);
      }
    }
  `,
];

export default styles;
