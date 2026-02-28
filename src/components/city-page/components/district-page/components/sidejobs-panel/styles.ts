import { css } from 'lit';
import { hintStyle, itemsListStyle } from '@shared/index';

const styles = [
  hintStyle,
  itemsListStyle,
  css`
    :host {
      display: block;
      width: 100%;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--ca-section-gap);
    }

    .items-list .header.desktop {
      grid-template-columns: 1fr 2fr;
    }
  `,
];

export default styles;
