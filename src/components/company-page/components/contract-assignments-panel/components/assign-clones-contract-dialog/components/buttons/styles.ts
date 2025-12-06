import { dialogButtonsStyle, warningStyle } from '@shared/index';
import { css } from 'lit';

const styles = [
  warningStyle,
  dialogButtonsStyle,
  css`
    :host {
      display: block;
    }
  `,
];

export default styles;
