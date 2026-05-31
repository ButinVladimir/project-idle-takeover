import { css } from 'lit';
import { pageTitleStyle } from '@shared/index';

const styles = [
  pageTitleStyle,
  css`
    div.server-links {
      margin-top: 0;
      margin-bottom: var(--sl-spacing-large);
      display: flex;
      flex-wrap: wrap;
      gap: var(--sl-spacing-medium);

      a {
        &,
        &:visited,
        &:hover {
          text-decoration: none;
          color: var(--sl-color-primary-600);
        }
      }
    }

    div.contributors {
      p {
        margin: 0;
      }
    }
  `,
];

export default styles;
