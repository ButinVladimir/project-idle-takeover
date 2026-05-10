import { css } from 'lit';
import { batchDetailsStyle, detailsStyle, subSectionTitleStyle, warningStyle } from '@shared/index';

const styles = [
  subSectionTitleStyle,
  detailsStyle,
  batchDetailsStyle,
  warningStyle,
  css`
    :host {
      display: block;
    }
  `,
];

export default styles;
