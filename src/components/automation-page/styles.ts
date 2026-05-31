import { css } from 'lit';
import { hintStyle, sectionTitleStyle, pageTitleStyle } from '@shared/index';

export const autobuyerStyles = [
  hintStyle,
  sectionTitleStyle,
  css`
    :host {
      display: contents;
    }

    .host-content {
      width: 100%;
      background-color: var(--sl-panel-background-color);
      padding: var(--sl-spacing-large);
      box-sizing: border-box;
      border: var(--ca-border);
      border-radius: var(--sl-border-radius-small);
      display: grid;
      row-gap: var(--sl-spacing-small);
      column-gap: var(--sl-spacing-large);

      & h4.title {
        grid-area: title;
        margin: 0;
      }

      & p.hint {
        grid-area: hint;
        margin: 0;
      }

      div.input-container {
        grid-area: input;
        width: 100%;
        display: flex;

        & sl-input {
          width: 100%;
        }
      }
    }

    .host-content.mobile {
      grid-template-areas:
        'title'
        'input'
        'hint';
    }

    .host-content.desktop {
      grid-template-areas:
        'title input'
        'hint input';
      grid-template-rows: auto auto;
      grid-template-columns: 1fr auto;

      & div.input-container {
        grid-area: input;
        width: 15rem;
        align-items: center;
        height: 100%;
      }
    }
  `,
];

const automationPageStyles = [
  pageTitleStyle,
  css`
    :host {
      display: block;
    }
  `,
];

export default automationPageStyles;
