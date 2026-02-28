import { css } from 'lit';
import { inputLabelStyle, hintStyle, sectionTitleStyle, mediumModalStyle, formStyle, modalStyle } from '@shared/index';

const styles = [
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  mediumModalStyle,
  modalStyle,
  formStyle,
  css`
    div.inputs-container.desktop {
      grid-template-columns: 2fr 1fr 1fr;
    }
  `,
];

export default styles;
