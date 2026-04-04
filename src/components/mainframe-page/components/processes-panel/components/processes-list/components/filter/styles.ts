import { css } from 'lit';
import { inputLabelStyle, itemsListFilterStyle } from '@shared/index';

const styles = [
  inputLabelStyle,
  itemsListFilterStyle,
  css`
    :host {
      display: contents;
    }
  `,
];

export default styles;
