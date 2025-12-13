import constants from '@configs/constants.json';
import names from '@configs/names.json';
import {
  GameStateEvent,
  Language,
  MiscMenuItem,
  OverviewMenuItem,
  Theme,
  ProgramsEvent,
  LongNumberFormat,
  GameStateAlert,
  ProgramAlert,
  PurchaseType,
  IncomeSource,
  NotificationType,
  GameVersion,
  Feature,
  Attribute,
  Skill,
  ClonesEvent,
  CloneAlert,
  CityEvent,
  SidejobsEvent,
  SidejobAlert,
  MessageEventGroup,
  GameAlertGroup,
  Hotkey,
  DistrictTypeRewardParameter,
  ContractAlert,
  ContractsEvent,
  ActivityUIActivityStatus,
  PrimaryActivitiesEvent,
} from './types';
import { INames, type IConstants } from './interfaces';

export const typedConstants = constants as IConstants;
export const typedNames = names as INames;

export const CURRENT_VERSION = GameVersion['0.3.0'];

export const LANGUAGES: Language[] = Object.values(Language);

export const THEMES: Theme[] = Object.values(Theme);

export const OVERVIEW_MENU_ITEMS: OverviewMenuItem[] = Object.values(OverviewMenuItem);

export const MISC_MENU_ITEMS: MiscMenuItem[] = Object.values(MiscMenuItem);

export const MESSAGE_EVENT_GROUP_LIST = Object.values(MessageEventGroup);

export const MESSAGE_EVENT_GROUPS = {
  [MessageEventGroup.gameState]: Object.values(GameStateEvent),
  [MessageEventGroup.programs]: Object.values(ProgramsEvent),
  [MessageEventGroup.clones]: Object.values(ClonesEvent),
  [MessageEventGroup.sidejobs]: Object.values(SidejobsEvent),
  [MessageEventGroup.contracts]: Object.values(ContractsEvent),
  [MessageEventGroup.primaryActivities]: Object.values(PrimaryActivitiesEvent),
  [MessageEventGroup.city]: Object.values(CityEvent),
};

export const GAME_ALERT_GROUP_LIST = Object.values(GameAlertGroup);

export const GAME_ALERT_GROUPS = {
  [GameAlertGroup.gameState]: Object.values(GameStateAlert),
  [GameAlertGroup.programs]: Object.values(ProgramAlert),
  [GameAlertGroup.clones]: Object.values(CloneAlert),
  [GameAlertGroup.sidejobs]: Object.values(SidejobAlert),
  [GameAlertGroup.contracts]: Object.values(ContractAlert),
};

export const FORCE_NOTIFICATION_TYPES: Set<NotificationType> = new Set<NotificationType>([
  NotificationType.gameVersionUpdated,
]);

export const NOTIFICATION_TYPES: NotificationType[] = Object.values(NotificationType).filter(
  (notificationType) => !FORCE_NOTIFICATION_TYPES.has(notificationType),
);

export const QUALITIES: number[] = [0, 1, 2, 3, 4, 5, 6];

export const LONG_NUMBER_FORMATS: LongNumberFormat[] = Object.values(LongNumberFormat);

export const MS_IN_SECOND = 1000;

export const PURCHASE_TYPES: PurchaseType[] = Object.values(PurchaseType);

export const INCOME_SOURCES: IncomeSource[] = Object.values(IncomeSource);

export const FEATURES: Feature[] = Object.values(Feature);

export const ATTRIBUTES: Attribute[] = Object.values(Attribute);

export const SKILLS: Skill[] = Object.values(Skill);

export const RANDOM_TYPE = 'random';

export const HOTKEYS = Object.values(Hotkey);

export const SCHEMA_PROPERTY = '$schema';

export const DISTRICT_TYPE_REWARD_PARAMETERS = Object.values(DistrictTypeRewardParameter);

export const DISTRICT_TYPE_REWARD_PARAMETER_VISIBILITY_VALUES: Record<
  DistrictTypeRewardParameter,
  {
    requirements: Feature[];
    isSpeed: boolean;
  }
> = {
  [DistrictTypeRewardParameter.money]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.developmentPoints]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.experience]: {
    requirements: [],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.influence]: {
    requirements: [Feature.influence],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.connectivity]: {
    requirements: [Feature.connectivity],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.codeBase]: {
    requirements: [Feature.codeBase],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.computationalBase]: {
    requirements: [Feature.computationalBase],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.rewards]: {
    requirements: [Feature.rewards],
    isSpeed: true,
  },
  [DistrictTypeRewardParameter.processCompletionSpeed]: {
    requirements: [],
    isSpeed: false,
  },
  [DistrictTypeRewardParameter.experienceShareMultiplier]: {
    requirements: [Feature.experienceShare],
    isSpeed: false,
  },
};

export const ACTIVITY_UI_STATUSES = Object.values(ActivityUIActivityStatus);
