import { msg } from '@lit/localize';

export const CLONE_TEMPLATE_TEXTS: Record<
  string,
  {
    title: () => string;
    overview: () => string;
  }
> = {
  anthrodrone: {
    title: () => msg('Anthrodrone'),
    overview: () =>
      msg(`Leftover biomass fused with crude implants.
Can do everything but without outstanding results.`),
  },
  fixer: {
    title: () => msg('Fixer'),
    overview: () => msg(`Clone, specialized on negotiaing and dealing with large amount of information.`),
  },
  bouncer: {
    title: () => msg('Bouncer'),
    overview: () => msg(`Clone, specialized on close combat.`),
  },
  gunner: {
    title: () => msg('Gunner'),
    overview: () => msg(`Clone, specialized on ranged combat.`),
  },
};
