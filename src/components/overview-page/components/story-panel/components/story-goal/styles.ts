import { css } from 'lit';
import { sectionTitleStyle, detailsStyle } from '@shared/index';

const styles = [
  sectionTitleStyle,
  detailsStyle,
  css`
    :host {
      display: block;
    }

    h4.title {
      margin-bottom: 0;
    }

    article {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ca-paragraph-gap);
    }

    article p {
      margin: 0;
    }
  `,
];

export default styles;
