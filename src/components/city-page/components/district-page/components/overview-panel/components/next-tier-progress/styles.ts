import { css } from 'lit';
import { progressBarHintStyle, progressBarTitleStyle } from '@shared/index';

const styles = [
  progressBarTitleStyle,
  progressBarHintStyle,
  css`
    :host {
      display: block;
    }

    sl-progress-bar {
      --height: var(--sl-spacing-2x-large);
    }
  `,
];

export default styles;
