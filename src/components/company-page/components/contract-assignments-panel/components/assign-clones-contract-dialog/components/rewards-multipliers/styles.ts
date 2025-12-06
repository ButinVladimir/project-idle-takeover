import { css } from 'lit';
import { attributesSkillsTablesStyle, highlightedValuesStyle, subSectionTitleStyle } from '@shared/index';

const styles = [
  subSectionTitleStyle,
  attributesSkillsTablesStyle,
  highlightedValuesStyle,
  css`
    :host {
      display: block;
    }
  `,
];

export default styles;
