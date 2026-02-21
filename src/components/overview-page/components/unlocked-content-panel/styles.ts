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
      column-gap: var(--ca-table-column-gap);
      row-gap: var(--ca-table-row-gap);
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
      gap: var(--ca-table-row-gap);
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
      margin-bottom: var(--ca-section-gap);
    }

    div.item-type-filter-container {
      margin-bottom: var(--ca-section-gap);

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
      gap: var(--ca-section-gap);
    }
  `,
];

export default styles;
