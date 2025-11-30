import { css } from 'lit';
import { highlightedValuesStyle, hintStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  hintStyle,
  css`
    :host {
      display: flex;
      align-items: stretch;
      gap: 0;
      flex-direction: column;
    }

    p.hint {
      margin: 0 0 var(--sl-spacing-medium);
    }

    p.text {
      margin: 0;
    }

    sl-radio-group {
      margin: var(--sl-spacing-medium) 0;
    }
  `,
];

export default styles;
