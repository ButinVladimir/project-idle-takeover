import { css } from 'lit';
import { inputLabelStyle, itemsListFilterStyle } from '@shared/index';

const styles = [
  inputLabelStyle,
  itemsListFilterStyle,
  css`
    :host {
      display: contents;
    }

    .filter {
      width: 100%;
      padding: var(--ca-section-padding) 0;
      border-bottom: var(--ca-border);
    }
  `,
];

export default styles;
