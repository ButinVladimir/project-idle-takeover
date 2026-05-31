import { css } from 'lit';
import { inputLabelStyle } from '@shared/styles';

const styles = [
  inputLabelStyle,
  css`
    :host {
      display: block;
    }

    div.state-filter-container {
      margin-bottom: var(--ca-section-gap);

      &.mobile {
        width: 100%;
      }

      &.desktop {
        width: 30rem;
        max-width: 100%;
      }
    }

    div.goals-list {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ca-panel-row-gap);
    }
  `,
];

export default styles;
