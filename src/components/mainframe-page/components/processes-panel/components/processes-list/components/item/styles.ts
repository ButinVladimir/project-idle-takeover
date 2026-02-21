import { css } from 'lit';
import { dragIconStyle } from '@shared/index';

const styles = [
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

      .buttons {
        grid-area: buttons;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: var(--ca-table-buttons-gap);
      }

      &.desktop {
        grid-template-areas: 'program cores progress-bar buttons';
        grid-template-columns: 3fr 1fr 2fr auto;
        grid-template-rows: auto;
        align-items: center;

        .buttons {
          justify-content: flex-end;
          font-size: var(--sl-font-size-large);
        }
      }

      &.mobile {
        grid-template-areas:
          'program'
          'progress-bar'
          'cores'
          'buttons';
        grid-template-columns: auto;
        grid-template-rows: repeat(1fr);

        .buttons {
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
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

    #delete-btn::part(base):hover {
      color: var(--sl-color-danger-600);
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
    }

    .program-description.visible {
      height: auto;
      padding-top: var(--ca-table-paragraph-gap);
    }
  `,
];

export default styles;
