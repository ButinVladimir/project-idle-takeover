import { css } from 'lit';

const styles = css`
  :host {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ca-buttons-gap);
  }

  input#import-file {
    display: none;
  }
`;

export default styles;
