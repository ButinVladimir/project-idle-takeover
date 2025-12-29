import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: flex;
      align-items: stretch;
      gap: var(--sl-spacing-medium);
      flex-direction: column;
    }

    p.hint {
      margin: 0;
    }

    p.text {
      margin: 0;
    }
  `,
];

export default styles;
