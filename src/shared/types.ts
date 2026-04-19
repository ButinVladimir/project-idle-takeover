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
  displayedProcessesDeleted = 'displayedProcessesDeleted',
}

export enum ClonesEvent {
  clonePurchased = 'clonePurchased',
  cloneLevelUpgraded = 'cloneLevelUpgraded',
  cloneDeleted = 'cloneDeleted',
  displayedClonesDeleted = 'displayedClonesDeleted',
  cloneLevelReached = 'cloneLevelReached',
  cloneRenamed = 'cloneRenamed',
  cloneReplaced = 'cloneReplaced',
}

export enum SidejobsEvent {
  sidejobAssigned = 'sidejobAssigned',
  sidejobCancelled = 'sidejobCancelled',
  displayedSidejobsCancelled = 'displayedSidejobsCancelled',
}

export enum ContractsEvent {
  contractAssigned = 'contractAssigned',
  contractAssignmentRemoved = 'contractAssignmentRemoved',
  displayedContractAssignmentsRemoved = 'displayedContractAssignmentsRemoved',
}

export enum PrimaryActivitiesEvent {
  primaryActivityAdded = 'primaryActivityAdded',
  primaryActivityFinished = 'primaryActivityFinished',
  primaryActivityCancelled = 'primaryActivityCancelled',
  displayedPrimaryActivitiesCancelled = 'displayedPrimaryActivitiesCancelled',
}

export enum CityEvent {
  districtTierIncreased = 'districtTierIncreased',
}

export enum MessageEventGroup {
  gameState = 'gameState',
  programs = 'programs',
  clones = 'clones',
  sidejobs = 'sidejobs',
  contracts = 'contracts',
  primaryActivities = 'primaryActivities',
  city = 'city',
}

export type MessageEvent =
  | GameStateEvent
  | ProgramsEvent
  | ClonesEvent
  | SidejobsEvent
  | ContractsEvent
  | PrimaryActivitiesEvent
  | CityEvent;

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
  deleteDisplayedProcesses = 'deleteDisplayedProcesses',
}

export enum CloneAlert {
  cloneDelete = 'cloneDelete',
  deleteDisplayedClones = 'deleteDisplayedClones',
}

export enum SidejobAlert {
  sidejobCancel = 'sidejobCancel',
  cancelDisplayedSidejobs = 'cancelDisplayedSidejobs',
  replaceSidejob = 'replaceSidejob',
}

export enum ContractAlert {
  contractAssignmentRemove = 'contractAssignmentCancel',
  removeDisplayedContractAssignments = 'cancelDisplayedContractAssignments',
  replaceContractAssignment = 'replaceContractAssignment',
}

export enum PrimaryActivityAlert {
  cancelDisplayedPrimaryActivities = 'cancelDisplayedPrimaryActivities',
  cancelPrimaryActivity = 'cancelPrimaryActivity',
}

export enum GameAlertGroup {
  gameState = 'gameState',
  programs = 'programs',
  clones = 'clones',
  sidejobs = 'sidejobs',
  contracts = 'contracts',
  primaryActivity = 'primaryActivity',
}

export type GameAlert =
  | GameStateAlert
  | ProgramAlert
  | CloneAlert
  | SidejobAlert
  | ContractAlert
  | PrimaryActivityAlert;

export enum NotificationType {
  storyEvent = 'storyEvent',
  milestoneReached = 'milestoneUnlocked',
  timeAccumulated = 'timeAccumulated',
  gameVersionUpdated = 'gameVersionUpdated',
  activityUnlocked = 'activityUnlocked',
  designUnlocked = 'designUnlocked',
  factionsAvailable = 'factionsAvailable',
  factionJoined = 'factionJoined',
  districtContested = 'districtContested',
  districtCaptured = 'districtCaptured',
  allMilestonesReached = 'allMilestonesReached',
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
  primaryActivity = 'primaryActivity',
}

export enum Milestone {
  unlockedAutomation = 'unlockedAutomation',
  unlockedAutomationMainframeHardware = 'unlockedAutomationMainframeHardware',
  unlockedAutomationMainframePrograms = 'unlockedAutomationMainframePrograms',
  unlockedMainframePrograms = 'unlockedMainframePrograms',
  unlockedMainframeHardware = 'unlockedMainframeHardware',
  unlockedCompanyManagement = 'unlockedCompanyManagement',
  unlockedCodeBase = 'unlockedCodeBase',
  unlockedComputationalBase = 'unlockedComputationalBase',
  unlockedConnectivity = 'unlockedConnectivity',
  unlockedRewards = 'unlockedRewards',
  unlockedExperienceShare = 'unlockedExperienceShare',
  unlockedInfluence = 'unlockedInfluence',
  unlockedFactions = 'unlockedFactions',
  unlockedPrimaryActivity = 'unlockedPrimaryActivity',
  reachedEndOfTheGame = 'reachedEndOfTheGame',
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
  addContractAssignments = 'addContractAssignments',
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

export enum ActivityUIActivityStatus {
  active = 'active',
  valid = 'valid',
  notAvailable = 'notAvailable',
  invalid = 'invalid',
}

export enum LevelFilterValue {
  all = 'all',
  maxed = 'maxed',
  belowMax = 'belowMax',
}

export enum StateFilterValue {
  all = 'all',
  enabled = 'enabled',
  disabled = 'disabled',
}

export enum ActivityStatusFilterValue {
  all = 'all',
  active = 'active',
  inactive = 'inactive',
}
