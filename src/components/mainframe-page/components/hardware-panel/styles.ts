import { css } from 'lit';
import { hintStyle } from '@shared/index';

const styles = [
  hintStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    p.hint {
      margin: 0 0 var(--ca-section-gap);
    }

    ca-sortable-list {
      width: 100%;
      display: block;

      &::part(list) {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: var(--ca-panel-row-gap);
      }
    }

    div.buttons-block {
      margin: 0 0 var(--ca-section-gap) 0;
    }
  `,
];

export default styles;
