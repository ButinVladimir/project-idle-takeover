import { css } from 'lit';
import { dragIconStyle, hintIconStyle } from '@shared/index';

const styles = [
  hintIconStyle,
  dragIconStyle,
  css`
    :host {
      display: block;
    }

    .host-content {
      display: grid;
      gap: var(--ca-table-column-gap);
      padding: var(--ca-table-column-gap);
      box-sizing: border-box;

      &.mobile {
        grid-template-columns: auto;
        grid-template-rows: repeat(1fr);
      }

      &.desktop {
        grid-template-columns: 2fr 1fr 1fr auto;
        grid-template-rows: auto;
        align-items: center;
      }
    }

    .program-title {
      cursor: grab;

      sl-icon-button.description-button {
        position: relative;
        top: 0.25rem;
      }
    }

    .program-description {
      box-sizing: border-box;
      height: 0;
      overflow: hidden;
      color: var(--ca-hint-color);
      font-size: var(--ca-hint-font-size);
      line-height: var(--ca-hint-line-height);

      &.visible {
        height: auto;
        padding-top: var(--ca-table-column-gap);
      }
    }
  `,
];

export default styles;
