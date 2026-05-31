import { css } from 'lit';
import { itemsListButtonsStyle } from '@shared/index';

const styles = [
  itemsListButtonsStyle,
  css`
    :host {
      display: contents;
    }

    #delete-btn::part(base):hover {
      color: var(--ca-danger-color);
    }
  `,
];

export default styles;
