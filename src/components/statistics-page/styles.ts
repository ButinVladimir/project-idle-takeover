import { css } from 'lit';
import { sectionTitleStyle, detailsStyle, hintIconStyle, pageTitleStyle } from '@shared/index';

export const statisticsPanelStyle = css`
  :host {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: var(--ca-panel-row-gap);
  }
`;

export const statisticsPanelContentStyle = [
  sectionTitleStyle,
  detailsStyle,
  hintIconStyle,
  css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ca-panel-row-gap);
    }

    h4.title {
      margin-bottom: 0;
    }

    .parameters-table {
      width: 100%;
      display: grid;
      column-gap: var(--ca-table-column-gap);
      row-gap: var(--ca-table-row-gap);
      grid-template-columns: 1fr auto;
      grid-auto-rows: auto;

      & > div:nth-child(even) {
        text-align: end;
        white-space: nowrap;
      }
    }
  `,
];

const styles = [
  pageTitleStyle,
  css`
    :host {
      display: block;
    }
  `,
];

export default styles;
