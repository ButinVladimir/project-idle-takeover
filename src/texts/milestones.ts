import { msg } from '@lit/localize';
import { Milestone } from '@shared/types';

export const MILESTONE_TEXTS: Record<Milestone, { title: () => string; hint: () => string; message: () => string }> = {
  [Milestone.unlockedAutomation]: {
    title: () => msg('Unlocked basic automation'),
    hint: () => msg('Automation page and clone level autoupgrade are available'),
    message: () =>
      msg(`Automation page and clone level autoupgrade settings are now available.
New program is available.
`),
  },
  [Milestone.unlockedAutomationMainframeHardware]: {
    title: () => msg('Unlocked mainframe hardware automation'),
    hint: () => msg('Mainframe hardware automation settings are available on automation page'),
    message: () =>
      msg(`Mainframe hardware automation settings are now available on automation page.
New program is available.`),
  },
  [Milestone.unlockedAutomationMainframePrograms]: {
    title: () => msg('Unlocked mainframe programs automation'),
    hint: () => msg('Mainframe programs automation settings are available on automation page'),
    message: () =>
      msg(`Mainframe programs automation settings are now available on automation page.
New program is available.`),
  },
  [Milestone.unlockedMainframePrograms]: {
    title: () => msg('Unlocked mainframe programs'),
    hint: () => msg('Mainframe programs are upgradable'),
    message: () => msg('Mainframe programs are now upgradable.'),
  },
  [Milestone.unlockedMainframeHardware]: {
    title: () => msg('Unlocked mainframe hardware'),
    hint: () => msg('Mainframe hardware is upgradable'),
    message: () => msg('Mainframe hardware is now upgradable.'),
  },
  [Milestone.unlockedCompanyManagement]: {
    title: () => msg('Unlocked company management'),
    hint: () => msg('Making clones from templates and sending them to perform sidejobs in the city is possible'),
    message: () =>
      msg(`Company management is now available.
It's now possible to make clones from templates and send them to perform sidejobs in the city.`),
  },
  [Milestone.unlockedCodeBase]: {
    title: () => msg('Unlocked code base points'),
    hint: () => msg('Code base points reduce cost of purchasing mainframe programs'),
    message: () =>
      msg(`Code base points are now available.
Increase them to make mainframe programs cheaper.
Multipliers for programs and districts stack.`),
  },
  [Milestone.unlockedComputationalBase]: {
    title: () => msg('Unlocked computational base points'),
    hint: () => msg('Computational base points reduce cost of upgrading mainframe hardware'),
    message: () =>
      msg(`Computational base points are now available.
Increase them to make mainframe hardware cheaper.
Multipliers for programs and districts stack.`),
  },
  [Milestone.unlockedConnectivity]: {
    title: () => msg('Unlocked connectivity points'),
    hint: () => msg('Connectivity points increase chances to receive new contracts and sidejobs'),
    message: () =>
      msg(`Connectivity points are now available.
Increase them to unlock more sidejobs and to increase chances of receiving new contracts from selected faction.
Multipliers for programs and districts stack.`),
  },
  [Milestone.unlockedRewards]: {
    title: () => msg('Unlocked rewards points'),
    hint: () => msg('Rewards points increase rewards from everything'),
    message: () =>
      msg(`Rewards points are now available.
Increase them to get more rewards from everything.
Multipliers for programs and districts stack.`),
  },
  [Milestone.unlockedExperienceShare]: {
    title: () => msg('Unlocked experience share'),
    hint: () => msg('Clones can share their experience between each other'),
    message: () =>
      msg(`Clone experience is now can be shared between them.
Whenever clone receives experience, all available clones in company will receive part of it.
How big is this part depends on running processes and available synchronization.`),
  },
  [Milestone.unlockedInfluence]: {
    title: () => msg('Unlocked faction influence'),
    hint: () => msg('Faction influence and progress to next tier are now visible'),
    message: () =>
      msg(`Faction influence and progress to next tier are now visible.
The higher district tier is, the better rewards are from performing activity within it.`),
  },
  [Milestone.unlockedFactions]: {
    title: () => msg('Unlocked factions'),
    hint: () => msg('Factions are now available'),
    message: () =>
      msg(`Factions are now available.
Joining a faction gives access to it's loaned designs and contracts.`),
  },
  [Milestone.unlockedPrimaryActivity]: {
    title: () => msg('Unlocked primary actvity and contracts'),
    hint: () => msg('Primary activity and contracts are now available'),
    message: () =>
      msg(`Primary activity and contracts are now available.
Primary activity can increase certain parameters, like faction influence and notoriety points, and provide substantial rewards.`),
  },
  [Milestone.reachedEndOfTheGame]: {
    title: () => msg('Reached the end of the game'),
    hint: () => msg('The end of the game was reached'),
    message: () => msg(`The end of the game was reached.`),
  },
};
