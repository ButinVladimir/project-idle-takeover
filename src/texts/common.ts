import { msg, str } from '@lit/localize';
import { Attribute, ItemCategory, RewardParameter, Skill } from '@shared/types';
import { html } from 'lit';

export const COMMON_TEXTS = {
  notEnoughMoney: () => msg('Not enough money'),
  willBeAvailableIn: (timeElement: any) => msg(html`Will be available in ${timeElement}`),
  higherDevelopmentLevelRequired: () => msg('Higher development level required'),
  buyMax: () => msg('Buy max'),
  enableAutoupgrade: () => msg('Enable autoupgrade'),
  disableAutoupgrade: () => msg('Disable autoupgrade'),
  enableAutoupgradeAll: () => msg('Enable autoupgrade for all'),
  disableAutoupgradeAll: () => msg('Disable autoupgrade for all'),
  showDescription: () => msg('Show description'),
  hideDescription: () => msg('Hide description'),
  showDetails: () => msg('Show details'),
  hideDetails: () => msg('Hide details'),
  upgrade: () => msg('Upgrade'),
  upgradeAll: () => msg('Upgrade all'),
  upgradeToLevel: (valueElement: any) => msg(html`Upgrade to level ${valueElement}`),
  upgradeIncrease: (increase: string) => msg(str`Upgrade x${increase}`),
  level: () => msg('Level'),
  tier: () => msg('Tier'),
  cancel: () => msg('Cancel'),
  continue: () => msg('Continue'),
  close: () => msg('Close'),
  purchase: () => msg('Purchase'),
  menu: () => msg('Menu'),
  requirements: () => msg('Requirements'),
  rewards: () => msg('Rewards'),
  rewardsMultipliers: () => msg('Rewards multipliers'),
  attributes: () => msg('Attributes'),
  skills: () => msg('Skills'),
  cost: () => msg('Cost'),
  synchronization: () => msg('Synchronization'),
  experienceMultiplier: () => msg('Experience multiplier'),
  faction: () => msg('Faction'),
  parameterValue: (parameterName: string, valueElement: any) => msg(html`${parameterName}: ${valueElement}`),
  parameterDiff: (valueElement: any, diffElement: any) => msg(html`${valueElement} (${diffElement})`),
  parameterSpeed: (value: any) => msg(html`${value} per second`),
  parameterSpeedDiff: (valueElement: any, diffElement: any) => msg(html`${valueElement} (${diffElement}) per second`),
  hotkey: (hotkey?: string) => msg(str`Hotkey: ${hotkey?.toLocaleUpperCase() ?? ''}`),
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

export const REWARD_PARAMETER_NAMES = {
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
