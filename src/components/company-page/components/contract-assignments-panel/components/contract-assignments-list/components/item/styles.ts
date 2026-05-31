import { css } from 'lit';
import { dragIconStyle, itemsListButtonsStyle, itemsListItemStyle } from '@shared/index';

const styles = [
  dragIconStyle,
  itemsListItemStyle,
  itemsListButtonsStyle,
  css`
    :host {
      display: block;
    }

    .items-list-item.desktop {
      grid-template-columns: 2fr 1fr 1fr 1fr auto;

      .clones p {
        margin: 0;
      }

      #delete-btn::part(base):hover {
        color: var(--ca-danger-color);
      }
    }
  `,
];

export default styles;
