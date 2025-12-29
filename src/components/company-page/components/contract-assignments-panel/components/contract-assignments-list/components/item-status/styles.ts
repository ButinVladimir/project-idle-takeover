import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: contents;
    }

    .status-icon.desktop {
      font-size: var(--sl-font-size-large);
    }
  `,
];

export default styles;
