import { css } from 'lit';
import { hintStyle, sectionTitleStyle, dragIconStyle, highlightedValuesStyle, formStyle } from '@shared/index';

const styles = [
  hintStyle,
  sectionTitleStyle,
  dragIconStyle,
  highlightedValuesStyle,
  formStyle,
  css`
    :host {
      display: block;
    }

    :host(.dragged) .host-content {
      background-color: var(--ca-dragged-color);
    }

    .host-content {
      width: 100%;
      background-color: var(--sl-panel-background-color);
      padding: var(--sl-spacing-large);
      box-sizing: border-box;
      border: var(--ca-border);
      border-radius: var(--sl-border-radius-small);
      display: grid;

      row-gap: var(--ca-panel-row-gap);
      column-gap: var(--ca-panel-column-gap);

      div.button-container {
        grid-area: buttons;
        height: 100%;
      }

      div.title-row {
        grid-area: title;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      h4.title {
        margin: 0;
        cursor: grab;
      }

      p.hint {
        grid-area: hint;
        margin: 0;
      }

      p.cost {
        grid-area: cost;
        margin: 0;
      }

      #toggle-autoupgrade-btn {
        position: relative;
        top: 0.15em;
      }

      sl-icon[name='grip-vertical'] {
        top: 0.15em;
        left: -0.2em;
      }

      &.desktop {
        grid-template-areas:
          'title buttons'
          'cost buttons'
          'hint buttons';
        grid-template-rows: auto;
        grid-template-columns: 1fr auto;
      }

      &.mobile {
        grid-template-areas:
          'title'
          'cost'
          'buttons'
          'hint';
      }
    }
  `,
];

export default styles;
