import { msg, str } from '@lit/localize';
import {
  Attribute,
  StateFilterValue,
  DistrictTypeRewardParameter,
  ItemCategory,
  LevelFilterValue,
  RewardParameter,
  Skill,
} from '@shared/types';
import { html } from 'lit';

export const COMMON_TEXTS = {
  notEnoughMoney: () => msg('Not enough money'),
  willBeAvailableIn: (timeElement: any) => msg(html`Will be available in ${timeElement}`),
  higherDevelopmentLevelRequired: () => msg('Higher development level required'),
  buyMax: () => msg('Buy max'),
  autoupgrade: () => msg('Autoupgrade'),
  enableAutoupgrade: () => msg('Enable autoupgrade'),
  disableAutoupgrade: () => msg('Disable autoupgrade'),
  enableAutoupgradeDisplayed: () => msg('Enable autoupgrade for displayed items'),
  disableAutoupgradeDisplayed: () => msg('Disable autoupgrade for displayed items'),
  showDescription: () => msg('Show description'),
  hideDescription: () => msg('Hide description'),
  showDetails: () => msg('Show details'),
  hideDetails: () => msg('Hide details'),
  upgrade: () => msg('Upgrade'),
  upgradeFilteredEnabledItems: () => msg('Upgrade filtered enabled items'),
  upgradeAllEnabledItems: () => msg('Upgrade all enabled items'),
  upgradeToLevel: (valueElement: any) => msg(html`Upgrade to level ${valueElement}`),
  upgradeIncrease: (increase: string) => msg(str`Upgrade x${increase}`),
  level: () => msg('Level'),
  tier: () => msg('Tier'),
  cancel: () => msg('Cancel'),
  continue: () => msg('Continue'),
  close: () => msg('Close'),
  restoreValues: () => msg('Restore values'),
  purchase: () => msg('Purchase'),
  menu: () => msg('Menu'),
  requirements: () => msg('Requirements'),
  rewards: () => msg('Rewards'),
  rewardsMultipliers: () => msg('Rewards multipliers'),
  attributes: () => msg('Attributes'),
  skills: () => msg('Skills'),
  cost: () => msg('Cost'),
  totalCost: () => msg('Total cost'),
  synchronization: () => msg('Synchronization'),
  experienceMultiplier: () => msg('Experience multiplier'),
  faction: () => msg('Faction'),
  parameterRow: (parameterName: string, valueElement: any) => msg(html`${parameterName}: ${valueElement}`),
  parameterDiff: (valueElement: any, diffElement: any) => msg(html`${valueElement} (${diffElement})`),
  parameterSpeed: (value: any) => msg(html`${value} per second`),
  parameterSpeedDiff: (valueElement: any, diffElement: any) => msg(html`${valueElement} (${diffElement}) per second`),
  parameterCompletion: (valueElement: any) => msg(html`${valueElement} per completion`),
  parameterCompletionSpeed: (valueElement: any, speedElement: any) =>
    msg(html`${valueElement} per completion (${speedElement} per second)`),
  parameterCompletionSpeedDiff: (valueElement: any, diffElement: any, speedElement: any, speedDiffElement: any) =>
    msg(html`${valueElement} (${diffElement}) per completion (${speedElement} per second) (${speedDiffElement})`),
  hotkey: (hotkey?: string) => msg(str`Hotkey: ${hotkey?.toLocaleUpperCase() ?? msg('Unassigned')}`),
  completionTime: () => msg('Completion time'),
  enableFilter: () => msg('Enable filter'),
  disableFilter: () => msg('Disable filter'),
  resetFilter: () => msg('Reset filter'),
  maxTier: () => msg('Max tier'),
  maxLevel: () => msg('Max level'),
};

export const CATEGORY_TEXTS: Record<ItemCategory, () => string> = {
  programs: () => msg('Programs'),
  cloneTemplates: () => msg('Clone templates'),
};

export const ATTRIBUTE_TEXTS: Record<Attribute, () => string> = {
  strength: () => msg('Strength'),
  agility: () => msg('Agility'),
  charisma: () => msg('Charisma'),
  endurance: () => msg('Endurance'),
  intellect: () => msg('Intellect'),
  perception: () => msg('Perception'),
};

export const SKILL_TEXTS: Record<Skill, () => string> = {
  closeCombat: () => msg('Close combat'),
  rangedCombat: () => msg('Ranged combat'),
  diplomacy: () => msg('Diplomacy'),
  engineering: () => msg('Engineering'),
  hacking: () => msg('Hacking'),
  stealth: () => msg('Stealth'),
};

export const REWARD_PARAMETER_NAMES: Record<DistrictTypeRewardParameter | RewardParameter, () => string> = {
  [RewardParameter.money]: () => msg('Money'),
  [RewardParameter.developmentPoints]: () => msg('Development points'),
  [RewardParameter.experience]: () => msg('Experience'),
  [RewardParameter.influence]: () => msg('Faction influence'),
  [RewardParameter.connectivity]: () => msg('Connectivity points'),
  [RewardParameter.codeBase]: () => msg('Code base points'),
  [RewardParameter.computationalBase]: () => msg('Computational base points'),
  [RewardParameter.rewards]: () => msg('Rewards points'),
  [RewardParameter.processCompletionSpeed]: () => msg('Process completion speed multiplier'),
  [RewardParameter.actions]: () => msg('Actions'),
  [RewardParameter.experienceShareMultiplier]: () => msg('Shared experience multiplier'),
};

export const LEVEL_FILTER_TEXTS: Record<LevelFilterValue, () => string> = {
  [LevelFilterValue.all]: () => msg('Show everything'),
  [LevelFilterValue.maxed]: () => msg('Only items with max value'),
  [LevelFilterValue.belowMax]: () => msg('Only items with below max value'),
};

export const STATE_FILTER_TEXTS: Record<StateFilterValue, () => string> = {
  [StateFilterValue.all]: () => msg('Show everything'),
  [StateFilterValue.enabled]: () => msg('Only enabled'),
  [StateFilterValue.disabled]: () => msg('Only disabled'),
};
