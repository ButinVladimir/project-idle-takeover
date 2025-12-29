import { css } from 'lit';
import { progressBarHintStyle } from '@shared/index';

const styles = [
  progressBarHintStyle,
  css`
    :host {
      flex: 1 1 auto;
    }
  `,
];

export default styles;
