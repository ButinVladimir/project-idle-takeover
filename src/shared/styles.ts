import { css } from 'lit';
import { ActivityUIStatus, ActivityUIValidity } from './types';

export const LAYOUT_WIDTH_THRESHOLDS = {
  TABLET: 768,
  DESKTOP: 1440,
};

export const pageTitleStyle = css`
  h3.title {
    font-size: var(--sl-font-size-2x-large);
    font-weight: var(--sl-font-weight-bold);
    margin-top: 0;
    line-height: var(--sl-line-height-denser);
  }
`;

export const inputLabelStyle = css`
  span.input-label {
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
  }
`;

export const hintStyle = css`
  p.hint {
    color: var(--ca-hint-color);
    font-size: var(--ca-hint-font-size);
    line-height: var(--ca-hint-line-height);
  }
`;

export const warningStyle = css`
  p.warning {
    color: var(--ca-warning-color);
    font-size: var(--ca-warning-font-size);
    line-height: var(--ca-warning-line-height);
  }
`;

export const sectionTitleStyle = css`
  h4.title {
    font-size: var(--sl-font-size-large);
    font-weight: var(--sl-font-weight-bold);
    margin-top: 0;
    line-height: var(--sl-line-height-normal);
  }
`;

export const subSectionTitleStyle = css`
  h5.title {
    font-size: var(--sl-font-size-normal);
    font-weight: var(--sl-font-weight-bold);
    margin-top: 0;
    line-height: var(--sl-line-height-normal);
  }
`;

export const smallModalStyle = css`
  sl-dialog {
    --width: 600px;
  }
`;

export const mediumModalStyle = css`
  sl-dialog {
    --width: 900px;
  }
`;

export const modalBodyScrollStyle = css`
  sl-dialog::part(body) {
    scrollbar-width: thin;
  }
`;

export const detailsStyle = css`
  sl-details::part(base) {
    background-color: var(--sl-panel-background-color);
  }
`;

export const hintIconStyle = css`
  sl-icon[name='question-circle'] {
    position: relative;
    top: 0.25em;
    margin-left: 0.5em;
    color: var(--ca-hint-color);
    font-size: var(--sl-font-size-large);
  }
`;

export const HINT_ICON = 'question-circle';

export const DESCRIPTION_ICONS = {
  hidden: 'chevron-right',
  expanded: 'chevron-down',
};

export const ENTITY_ACTIVE_VALUES: {
  icon: {
    active: string;
    stopped: string;
  };
  buttonVariant: {
    active: 'neutral';
    stopped: 'default';
  };
} = {
  icon: {
    active: 'play-fill',
    stopped: 'pause-fill',
  },
  buttonVariant: {
    active: 'neutral',
    stopped: 'default',
  },
};

export const AUTOUPGRADE_VALUES: {
  icon: {
    enabled: string;
    disabled: string;
  };
  buttonVariant: {
    enabled: 'neutral';
    disabled: 'default';
  };
} = {
  icon: {
    enabled: 'arrow-up-circle-fill',
    disabled: 'arrow-up-circle',
  },
  buttonVariant: {
    enabled: 'neutral',
    disabled: 'default',
  },
};

export const DELETE_VALUES: {
  icon: string;
  buttonVariant: 'danger';
} = {
  icon: 'x-lg',
  buttonVariant: 'danger',
};

export const UPGRADE_MAX_VALUES: {
  icon: string;
  buttonVariant: 'default';
} = {
  icon: 'chevron-double-up',
  buttonVariant: 'default',
};

export const dragIconStyle = css`
  sl-icon[name='grip-vertical'] {
    position: relative;
    top: 0.2em;
    color: var(--ca-hint-color);
    font-size: var(--sl-font-size-large);
  }
`;

export const TOGGLE_DETAILS_VALUES: {
  icon: {
    enabled: string;
    disabled: string;
  };
  buttonVariant: {
    enabled: 'neutral';
    disabled: 'default';
  };
} = {
  icon: {
    enabled: 'eye',
    disabled: 'eye-slash',
  },
  buttonVariant: {
    enabled: 'neutral',
    disabled: 'default',
  },
};

export const attributesSkillsTablesStyle = css`
  div.attributes-skills-tables {
    width: 100%;
    display: flex;

    h5.title {
      margin: 0;
    }

    div.attributes-skills-table {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: auto;
      width: 100%;
      grid-column-gap: var(--sl-spacing-medium);

      & > div:nth-child(even) {
        text-align: end;
        white-space: nowrap;
      }
    }

    &.desktop {
      flex-direction: row;
      justify-content: flex;
      gap: var(--sl-spacing-3x-large);

      & > div {
        flex: 1;
      }
    }

    &.mobile {
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--sl-spacing-medium);
    }
  }
`;

export const highlightedValuesStyle = css`
  .success {
    color: var(--ca-success-color);
  }

  .danger {
    color: var(--ca-danger-color);
  }

  .warning {
    color: var(--ca-warning-color);
  }
`;

export const dialogButtonsStyle = css`
  p.warning {
    display: none;
    margin-top: var(--sl-spacing-3x-small);
    margin-bottom: 0;
  }

  p.warning.visible {
    display: block;
  }

  div.buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--sl-spacing-medium);
  }
`;

export const progressBarHintStyle = css`
  p.progress-bar-hint {
    color: var(--ca-hint-color);
    font-size: var(--ca-hint-font-size);
    line-height: var(--ca-hint-line-height);
    display: none;
    margin-top: var(--sl-spacing-3x-small);
    margin-bottom: 0;
  }

  p.progress-bar-hint.visible {
    display: block;
  }
`;

export const formStyle = css`
  form {
    display: contents;
  }
`;

export const ACTIVITY_UI_STATUS_VALUES = {
  [ActivityUIStatus.active]: {
    class: 'success',
    icon: 'play-fill',
  },
  [ActivityUIStatus.paused]: {
    class: 'warning',
    icon: 'pause-fill',
  },
  [ActivityUIStatus.invalid]: {
    class: 'danger',
    icon: 'exclamation-lg',
  },
};

export const ACTIVITY_UI_VALIDITY_VALUES = {
  [ActivityUIValidity.valid]: {
    class: 'success',
    icon: 'check-lg',
  },
  [ActivityUIValidity.invalid]: {
    class: 'danger',
    icon: 'x-lg',
  },
};
