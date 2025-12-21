import { msg } from '@lit/localize';

export const CONTRACT_TEXTS: Record<
  string,
  {
    title: () => string;
    overview: () => string;
  }
> = {
  guarding: {
    title: () => msg('Guarding'),
    overview: () => msg(`Performing guard duties.`),
  },
};
