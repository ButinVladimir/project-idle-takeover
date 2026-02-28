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

    p.hint {
      margin: 0;
    }

    p.text {
      margin: 0;

      &:not(:first-child) {
        margin-top: var(--ca-modal-paragraph-gap);
      }
    }

    sl-radio-group {
      margin: var(--ca-modal-section-gap) 0 var(--ca-modal-paragraph-gap);
    }
  `,
];

export default styles;
