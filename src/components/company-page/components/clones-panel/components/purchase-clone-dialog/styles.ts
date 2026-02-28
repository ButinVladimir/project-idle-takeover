import { css } from 'lit';
import { inputLabelStyle, hintStyle, sectionTitleStyle, mediumModalStyle, modalStyle, formStyle } from '@shared/index';

const styles = [
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  mediumModalStyle,
  modalStyle,
  formStyle,
  css`
    div.inputs-container.desktop {
      grid-template-rows: 1fr 1fr;
      grid-template-columns: 1fr 1fr;
    }
  `,
];

export default styles;
