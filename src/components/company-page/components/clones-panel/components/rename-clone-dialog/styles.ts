import { css } from 'lit';
import {
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  smallModalStyle,
  warningStyle,
  formStyle,
  modalStyle,
} from '@shared/index';

const styles = [
  inputLabelStyle,
  hintStyle,
  sectionTitleStyle,
  smallModalStyle,
  modalStyle,
  warningStyle,
  formStyle,
  css`
    div.footer {
      p.warning {
        margin: 0;
      }

      div.buttons {
        display: flex;
        justify-content: flex-end;
        gap: var(--ca-modal-buttons-gap);
      }
    }
  `,
];

export default styles;
