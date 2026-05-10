import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }

    sl-radio-group {
      margin: 0 0 var(--ca-modal-paragraph-gap);
    }
  `,
];

export default styles;
