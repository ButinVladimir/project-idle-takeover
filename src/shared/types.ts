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
  statistics = 'statistics',
  messageLog = 'messageLog',
}

export enum MiscMenuItem {
  settings = 'settings',
  credits = 'credits',
}

export enum Scenario {
  tutorial = 'tutorial',
}

export enum Faction {
  neutral = 'neutral',
  wsa = 'wsa',
}

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
}

export enum ProgramAlert {
  purchaseProgramOverwrite = 'purchaseProgramOverwrite',
  processDelete = 'processDelete',
  processReplace = 'processReplace',
  scalableProcessReplace = 'scalableProcessReplace',
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
  sidejobUnlocked = 'sidejobUnlocked',
  designUnlocked = 'designUnlocked',
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
  districtTiers = 'districtTiers',
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

export enum DistrictType {
  residential = 'residential',
  corpoDistrict = 'corpoDistrict',
}

export enum RewardParameter {
  money = 'money',
  developmentPoints = 'development-points',
  experience = 'experience',
  districtTierPoints = 'district-tier-points',
  connectivity = 'connectivity',
  codeBase = 'code-base',
  computationalBase = 'computational-base',
  rewards = 'rewards',
  processCompletionSpeedMultiplier = 'process-completion-speed-multiplier',
  actions = 'actions',
  sharedExperienceMultiplier = 'shared-experience-multiplier',
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
