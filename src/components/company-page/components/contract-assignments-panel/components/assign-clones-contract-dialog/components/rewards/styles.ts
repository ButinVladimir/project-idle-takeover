import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
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
