import { css } from 'lit';
import { dragIconStyle, hintStyle, sectionTitleStyle } from '@shared/index';

const styles = [
  sectionTitleStyle,
  hintStyle,
  dragIconStyle,
  css`
    :host {
      display: block;
    }

    sl-card {
      width: 100%;
    }

    :host(.dragged) sl-card::part(base) {
      background-color: var(--ca-dragged-color);
    }

    div.header {
      display: grid;
      grid-template-areas:
        'name menu'
        'description description';
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;

      h4.title {
        margin: 0;

        &[draggable='true'] {
          cursor: grab;
        }
      }

      h4.name {
        grid-area: name;

        sl-icon[name='grip-vertical'] {
          top: 0.15em;
          left: -0.2em;
        }
      }

      p.hint {
        margin: 0;
      }

      p.description {
        grid-area: description;
      }

      sl-icon-button.menu-button {
        grid-area: menu;
        align-self: center;
      }

      ca-clones-list-item-description {
        margin-top: var(--ca-panel-row-gap);
      }
    }

    #toggle-autoupgrade-btn {
      position: relative;
      top: 0.15em;
    }

    sl-popup {
      --arrow-color: var(--sl-color-neutral-200);
    }
  `,
];

export default styles;
