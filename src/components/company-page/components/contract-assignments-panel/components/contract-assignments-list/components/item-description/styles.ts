import { css } from 'lit';
import { highlightedValuesStyle } from '@shared/index';

const styles = [
  highlightedValuesStyle,
  css`
    :host {
      display: block;
      color: var(--ca-hint-color);
      font-size: var(--ca-hint-font-size);
      line-height: var(--ca-hint-line-height);
    }

    p.overview {
      margin-top: 0;
      margin-bottom: var(--ca-table-paragraph-gap);
    }

    p.rewards {
      margin-top: var(--ca-table-paragraph-gap);
      margin-bottom: 0;
    }

    p.text {
      margin: 0;
    }
  `,
];

export default styles;
