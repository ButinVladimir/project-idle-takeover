import { msg } from '@lit/localize';
import { FactionPlaystyle } from '@state/faction-state';

export const FACTION_PLAYSTYLE_TEXT: Record<FactionPlaystyle, { title: () => string; description: () => string }> = {
  [FactionPlaystyle.selectFaction]: {
    title: () => msg('Faction selection'),
    description: () => msg(`Select faction to proceed.`),
  },
  [FactionPlaystyle.captureCity]: {
    title: () => msg('Capture the city'),
    description: () =>
      msg(`Capture city districts and increase disticts tiers to earn faction reputation.
Threat level can be raised only by story events.`),
  },
  [FactionPlaystyle.raiseThreat]: {
    title: () => msg('Raise the threat level'),
    description: () =>
      msg(`City cannot be captured but threat level can be raised by earning notoriety points.
Designs have to be earned by performing operations and hacking.`),
  },
};
