import { css } from 'lit';
import { hintStyle, sectionTitleStyle } from '@shared/index';

const styles = [
  sectionTitleStyle,
  hintStyle,
  css`
    :host {
      display: block;
    }

    sl-card {
      width: 100%;
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
      }

      h4.name {
        grid-area: name;
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

      .description {
        margin-top: var(--sl-spacing-small);
      }
    }
  `,
];

export default styles;
