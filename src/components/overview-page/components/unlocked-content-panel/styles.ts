import { css } from 'lit';
import { sectionTitleStyle, detailsStyle, hintIconStyle, hintStyle } from '@shared/index';

export const unlockedItemsCategoryStyles = [
  sectionTitleStyle,
  detailsStyle,
  hintIconStyle,
  css`
    :host {
      display: block;
    }

    h4.title {
      margin-bottom: 0;
    }

    .content-table {
      display: grid;
      column-gap: var(--sl-spacing-small);
      row-gap: var(--sl-spacing-3x-small);
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;

      & > span:nth-child(even) {
        text-align: end;
        white-space: nowrap;
      }
    }
  `,
];

export const unlockedContentStyles = [
  sectionTitleStyle,
  detailsStyle,
  hintIconStyle,
  css`
    :host {
      display: block;
    }

    h4.title {
      margin-bottom: 0;
    }

    .content-table {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--sl-spacing-3x-small);
    }
  `,
];

const styles = [
  hintStyle,
  css`
    :host {
      display: block;
    }

    p.hint {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-large);
    }

    div.item-type-filter-container {
      margin-bottom: var(--sl-spacing-2x-large);

      &.mobile {
        width: 100%;
      }

      &.desktop {
        width: 30rem;
        max-width: 100%;
      }
    }

    div.categories {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      gap: var(--sl-spacing-large);
    }
  `,
];

export default styles;
