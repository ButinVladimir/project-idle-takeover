import { css } from 'lit';
import { dragIconStyle, itemsListItemButtonsStyle, itemsListItemStyle } from '@shared/index';

const styles = [
  dragIconStyle,
  itemsListItemStyle,
  itemsListItemButtonsStyle,
  css`
    :host {
      display: block;
    }

    .items-list-item {
      &.desktop {
        grid-template-areas: 'program cores progress-bar buttons';
        grid-template-columns: 3fr 1fr 2fr auto;

        #delete-btn::part(base):hover {
          color: var(--ca-danger-color);
        }
      }

      &.mobile {
        grid-template-areas:
          'program'
          'progress-bar'
          'cores'
          'buttons';
      }

      .program {
        grid-area: program;
      }

      .cores {
        grid-area: cores;
      }

      .progress-bar {
        grid-area: progress-bar;
      }

      .buttons {
        grid-area: buttons;
      }
    }
  `,
];

export default styles;
