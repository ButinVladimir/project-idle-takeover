import { css } from 'lit';
import { ActivityUIActivityStatus } from './types';

export const LAYOUT_WIDTH_THRESHOLDS = {
  TABLET: 768,
  DESKTOP: 1440,
};

export const pageTitleStyle = css`
  h3.title {
    font-size: var(--sl-font-size-2x-large);
    font-weight: var(--sl-font-weight-bold);
    margin-top: 0;
    margin-bottom: var(--ca-page-title-gap);
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

export const modalStyle = css`
  sl-dialog::part(body) {
    scrollbar-width: thin;
    padding-top: 0;
    padding-bottom: 0;
  }

  sl-dialog::part(footer) {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  :host {
    display: contents;
  }

  h4.title {
    margin: 0;
  }

  div.body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--ca-modal-section-gap);
  }

  p.hint {
    margin: 0;
  }

  div.inputs-container {
    display: grid;
    column-gap: var(--ca-input-column-gap);
    row-gap: var(--ca-input-row-gap);

    &.mobile {
      grid-template-columns: auto;
      grid-template-rows: auto;
    }

    &.desktop {
      grid-template-rows: auto;
      grid-template-columns: auto;
    }
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

export const FILTER_VALUES: {
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
    enabled: 'funnel-fill',
    disabled: 'funnel',
  },
  buttonVariant: {
    enabled: 'neutral',
    disabled: 'default',
  },
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
    gap: var(--ca-modal-buttons-gap);
  }
`;

export const progressBarTitleStyle = css`
  h5.progress-bar-title {
    font-size: var(--sl-font-size-small);
    line-height: var(--sl-line-height-dense);
    font-weight: var(--sl-font-weight-normal);
    margin-top: 0;
    margin-bottom: var(--sl-spacing-2x-small);
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

export const ACTIVITY_UI_ACTIVITY_VALUES = {
  [ActivityUIActivityStatus.active]: {
    class: 'success',
    icon: 'play-fill',
  },
  [ActivityUIActivityStatus.valid]: {
    class: 'success',
    icon: 'check-lg',
  },
  [ActivityUIActivityStatus.notAvailable]: {
    class: 'warning',
    icon: 'exclamation-lg',
  },
  [ActivityUIActivityStatus.invalid]: {
    class: 'danger',
    icon: 'x-lg',
  },
};

export const START_ACTIVITY_ICON = 'arrow-clockwise';

export const itemsListButtonsStyle = css`
  .buttons {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: var(--ca-table-buttons-gap);

    &.desktop {
      width: 132px;
      justify-content: flex-end;
      font-size: var(--sl-font-size-large);
    }

    &.mobile {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .tooltip-content p {
      margin: 0;
    }
  }
`;

export const itemsListStyle = css`
  .items-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-top: var(--ca-border);

    .header {
      display: grid;
      gap: var(--ca-table-column-gap);
      align-items: center;
      border-bottom: var(--ca-border);

      &.mobile {
        grid-template-columns: auto;
        grid-template-rows: auto;
        padding: var(--ca-table-column-gap) 0;
      }

      &.desktop {
        grid-template-columns: auto;
        grid-template-rows: auto;
        padding: var(--ca-table-column-gap);

        .header-column {
          font-weight: var(--sl-font-weight-bold);
        }
      }
    }

    .notification {
      padding: var(--ca-empty-notification-gap);
      text-align: center;
      border-bottom: var(--ca-border);
    }

    ca-sortable-list {
      width: 100%;

      &::part(list) {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
      }
    }

    .list {
      .list-item {
        &:nth-child(2n + 1) {
          background-color: var(--ca-table-row-odd-color);
        }

        &.dragged {
          background-color: var(--ca-dragged-color);
        }
      }
    }
  }
`;

export const itemsListItemStyle = css`
  .items-list-item {
    display: grid;
    gap: var(--ca-table-column-gap);
    padding: var(--ca-table-column-gap);
    box-sizing: border-box;
    border-bottom: var(--ca-border);

    .title[draggable='true'] {
      cursor: grab;
    }

    .title sl-icon-button.description-button {
      position: relative;
      top: 0.25rem;
    }

    .description {
      box-sizing: border-box;
      height: 0;
      overflow: hidden;
      color: var(--ca-hint-color);
      font-size: var(--ca-hint-font-size);
      line-height: var(--ca-hint-line-height);

      &.visible {
        height: auto;
        padding-top: var(--ca-table-paragraph-gap);
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: var(--ca-table-buttons-gap);
    }

    &.desktop {
      grid-template-columns: auto;
      grid-template-rows: auto;
      align-items: center;

      .buttons {
        width: 132px;
        justify-content: flex-end;
        font-size: var(--sl-font-size-large);
      }
    }

    &.mobile {
      grid-template-columns: auto;
      grid-template-rows: auto;

      .buttons {
        flex-wrap: wrap;
        justify-content: flex-start;
      }
    }
  }
`;

export const itemsListFilterStyle = css`
  .filter {
    display: flex;
    flex-direction: column;
    gap: var(--ca-input-row-gap);
    align-items: stretch;
    border-bottom: var(--ca-border);

    .filter-row {
      display: flex;
    }

    &.desktop {
      padding: var(--ca-filter-gap) 0;

      .filter-row {
        flex-direction: row;
        gap: var(--ca-input-column-gap);
        align-items: stretch;
        justify-content: space-between;

        * {
          flex: 1 0;
        }
      }
    }

    &.mobile {
      padding: var(--ca-filter-gap) 0;

      .filter-row {
        flex-direction: column;
        gap: var(--ca-input-row-gap);
      }
    }
  }
`;
