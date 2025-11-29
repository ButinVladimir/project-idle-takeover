export enum GameVersion {
  '0.1.1' = '0.1.1',
  '0.1.2' = '0.1.2',
  '0.1.3' = '0.1.3',
  '0.2.0' = '0.2.0',
  '0.2.1' = '0.2.1',
  '0.3.0' = '0.3.0',
}

export enum Language {
  en = 'en',
  ru = 'ru',
}

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export enum OverviewMenuItem {
  overview = 'overview',
  city = 'city',
  company = 'company',
  mainframe = 'mainframe',
  automation = 'automation',
  factions = 'factions',
  statistics = 'statistics',
  messageLog = 'messageLog',
}

export enum MiscMenuItem {
  settings = 'settings',
  credits = 'credits',
}

export type Faction = string | 'neutral' | 'scavs';

export enum GameStateEvent {
  gameStarted = 'gameStarted',
  gameSaved = 'gameSaved',
  fastForwared = 'fastForwarded',
  levelReached = 'levelReached',
}

export enum ProgramsEvent {
  performanceUpgraded = 'performanceUpgraded',
  coresUpgraded = 'coresUpgraded',
  ramUpgraded = 'ramUpgraded',
  programPurchased = 'programPurchased',
  processStarted = 'processStarted',
  processDeleted = 'processDeleted',
  allProcessesDeleted = 'allProcessesDeleted',
}

export enum ClonesEvent {
  clonePurchased = 'clonePurchased',
  cloneLevelUpgraded = 'cloneLevelUpgraded',
  cloneDeleted = 'cloneDeleted',
  allClonesDeleted = 'allClonesDeleted',
  cloneLevelReached = 'cloneLevelReached',
  cloneRenamed = 'cloneRenamed',
}

export enum SidejobsEvent {
  sidejobAssigned = 'sidejobAssigned',
  sidejobCancelled = 'sidejobCancelled',
  allSidejobsCancelled = 'allSidejobsCancelled',
}

export enum CityEvent {
  districtTierIncreased = 'districtTierIncreased',
}

export enum MessageEventGroup {
  gameState = 'gameState',
  programs = 'programs',
  clones = 'clones',
  sidejobs = 'sidejobs',
  city = 'city',
}

export type MessageEvent = GameStateEvent | ProgramsEvent | ClonesEvent | SidejobsEvent | CityEvent;

export enum GameStateAlert {
  saveImport = 'saveImport',
  saveDelete = 'saveDelete',
  clearMessages = 'clearMessages',
  fastForward = 'fastForward',
  unassignHotkeys = 'unassignHotkeys',
  restoreDefaultHotkeys = 'restoreDefaultHotkeys',
  restoreDefaultSettings = 'restoreDefaultSettings',
  joinFaction = 'joinFaction',
}

export enum ProgramAlert {
  purchaseProgramOverwrite = 'purchaseProgramOverwrite',
  processDelete = 'processDelete',
  processReplace = 'processReplace',
  deleteAllProcesses = 'deleteAllProcesses',
}

export enum CloneAlert {
  cloneDelete = 'cloneDelete',
  deleteAllClones = 'deleteAllClones',
}

export enum SidejobAlert {
  sidejobCancel = 'sidejobCancel',
  cancelAllSidejobs = 'cancelAllSidejobs',
  replaceSidejob = 'replaceSidejob',
}

export enum GameAlertGroup {
  gameState = 'gameState',
  programs = 'programs',
  clones = 'clones',
  sidejobs = 'sidejobs',
}

export type GameAlert = GameStateAlert | ProgramAlert | CloneAlert | SidejobAlert;

export enum NotificationType {
  storyEvent = 'storyEvent',
  featureUnlocked = 'featureUnlocked',
  timeAccumulated = 'timeAccumulated',
  gameVersionUpdated = 'gameVersionUpdated',
  activityUnlocked = 'activityUnlocked',
  designUnlocked = 'designUnlocked',
  factionsAvailable = 'factionsAvailable',
  factionJoined = 'factionJoined',
  districtContested = 'districtContested',
  districtCaptured = 'districtCaptured',
}

export enum LongNumberFormat {
  short = 'short',
  long = 'long',
  scientific = 'scientific',
  engineering = 'engineering',
}

export enum PurchaseType {
  mainframeHardware = 'mainframeHardware',
  mainframePrograms = 'mainframePrograms',
  clones = 'clones',
}

export enum IncomeSource {
  program = 'program',
  sidejob = 'sidejob',
}

export enum Feature {
  automation = 'automation',
  automationMainframeHardware = 'automationMainframeHardware',
  automationMainframePrograms = 'automationMainframePrograms',
  mainframePrograms = 'mainframePrograms',
  mainframeHardware = 'mainframeHardware',
  companyManagement = 'companyManagement',
  codeBase = 'codeBase',
  computationalBase = 'computationalBase',
  connectivity = 'connectivity',
  rewards = 'rewards',
  experienceShare = 'experienceShare',
  influence = 'influence',
  factions = 'factions',
}

export type PointsMultiplierType = 'codeBase' | 'computationalBase';

export type ItemCategory = 'programs' | 'cloneTemplates';

export enum Attribute {
  strength = 'strength',
  endurance = 'endurance',
  agility = 'agility',
  perception = 'perception',
  intellect = 'intellect',
  charisma = 'charisma',
}

export enum Skill {
  closeCombat = 'closeCombat',
  rangedCombat = 'rangedCombat',
  engineering = 'engineering',
  hacking = 'hacking',
  stealth = 'stealth',
  diplomacy = 'diplomacy',
}

export enum RewardParameter {
  money = 'money',
  developmentPoints = 'developmentPoints',
  experience = 'experience',
  influence = 'influence',
  connectivity = 'connectivity',
  codeBase = 'codeBase',
  computationalBase = 'computationalBase',
  rewards = 'rewards',
  processCompletionSpeed = 'processCompletionSpeed',
  experienceShareMultiplier = 'experienceShareMultiplier',
  actions = 'actions',
}

export enum DistrictTypeRewardParameter {
  money = 'money',
  developmentPoints = 'developmentPoints',
  experience = 'experience',
  influence = 'influence',
  connectivity = 'connectivity',
  codeBase = 'codeBase',
  computationalBase = 'computationalBase',
  rewards = 'rewards',
  processCompletionSpeed = 'processCompletionSpeed',
  experienceShareMultiplier = 'experienceShareMultiplier',
}

export enum RewardParameterWithBase {
  codeBase = 'codeBase',
  computationalBase = 'computationalBase',
  rewards = 'rewards',
}

export type Layout = 'mobile' | 'tablet' | 'desktop';

export enum Hotkey {
  pause = 'pause',
  playNormalSpeed = 'playNormalSpeed',
  playFastSpeed = 'playFastSpeed',
  saveGame = 'saveGame',
  upgradeMainframeHardware = 'upgradeMainframeHardware',
  upgradeMainframePerformance = 'upgradeMainframePerformance',
  upgradeMainframeRam = 'upgradeMainframeRam',
  upgradeMainframeCores = 'upgradeMainframeCores',
  upgradeMainframePrograms = 'upgradeMainframePrograms',
  upgradeClonesLevel = 'upgradeClonesLevel',
}

export enum MapSpecialEvent {
  districtUnlocked = 'districtUnlocked',
  factionsAvailable = 'factionsAvailable',
}
