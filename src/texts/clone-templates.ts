import { msg } from '@lit/localize';

export const CLONE_TEMPLATE_TEXTS: Record<string, {
  title: () => string;
  overview: () => string;
}> = {
  anthrodrone: {
    title: () => msg('Anthrodrone'),
    overview: () =>
      msg(`Leftover biomass fused with crude implants.
Can do everything but without outstanding results.`),
  },
};
