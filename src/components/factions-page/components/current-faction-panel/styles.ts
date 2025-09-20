import { css } from 'lit';
import { hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  css`
    :host {
      display: block;
    }

    p.text {
      margin: 0;
    }
  `,
];

export default styles;
