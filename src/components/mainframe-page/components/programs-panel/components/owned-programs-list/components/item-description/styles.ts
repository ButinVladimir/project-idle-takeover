import { css } from 'lit';

const styles = css`
  :host {
    display: block;
    white-space: normal;
  }

  p {
    margin: 0;
  }

  p.line-break {
    height: var(--ca-table-paragraph-gap);
  }
`;

export default styles;
