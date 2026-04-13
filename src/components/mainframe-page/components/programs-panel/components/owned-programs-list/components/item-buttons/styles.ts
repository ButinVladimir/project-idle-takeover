import { css } from 'lit';
import { dragIconStyle, hintIconStyle, itemsListItemButtonsStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  dragIconStyle,
  itemsListItemButtonsStyle,
  css`
    :host {
      display: contents;
    }
  `,
];

export default styles;
