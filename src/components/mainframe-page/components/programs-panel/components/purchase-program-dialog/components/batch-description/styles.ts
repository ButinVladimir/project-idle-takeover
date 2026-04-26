import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      margin-top: var(--ca-modal-section-gap);
      margin-bottom: 0;
      gap: var(--ca-modal-paragraph-gap);
    }

    p {
      margin: 0;
    }
  `,
];

export default styles;
