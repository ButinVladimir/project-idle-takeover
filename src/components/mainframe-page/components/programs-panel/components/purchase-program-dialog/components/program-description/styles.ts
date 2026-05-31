import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: block;
      margin-top: var(--ca-modal-section-gap);
      margin-bottom: 0;
    }

    p {
      margin: 0;
    }

    p.line-break {
      height: var(--ca-modal-paragraph-gap);
    }
  `,
];

export default styles;
