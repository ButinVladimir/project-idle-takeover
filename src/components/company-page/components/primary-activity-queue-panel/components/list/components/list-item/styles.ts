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
        'name delete-button'
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

      sl-icon-button.delete-button {
        grid-area: delete-button;
        align-self: center;

        &::part(base):hover {
          color: var(--ca-danger-color);
        }
      }

      .description {
        margin-top: var(--ca-table-paragraph-gap);
      }
    }
  `,
];

export default styles;
