import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: flex;
      align-items: stretch;
      gap: 0;
      flex-direction: column;
    }

    p.description {
      margin: 0 0 var(--ca-modal-paragraph-gap);
    }

    p.text {
      margin: 0;
    }

    sl-radio-group {
      margin: var(--ca-modal-section-gap) 0;
    }
  `,
];

export default styles;
