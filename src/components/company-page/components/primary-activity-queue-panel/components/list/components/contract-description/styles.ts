import { css } from 'lit';
import { hintStyle, progressBarHintStyle, progressBarTitleStyle } from '@shared/index';

const styles = [
  hintStyle,
  progressBarTitleStyle,
  progressBarHintStyle,
  css`
    :host {
      display: block;
    }

    sl-progress-bar {
      --height: var(--sl-spacing-large);
    }

    p.text {
      margin: 0;
    }
  `,
];

export default styles;
