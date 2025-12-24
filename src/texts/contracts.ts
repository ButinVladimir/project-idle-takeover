import { msg } from '@lit/localize';

export const CONTRACT_TEXTS: Record<
  string,
  {
    title: () => string;
    overview: () => string;
  }
> = {
  security: {
    title: () => msg('Security'),
    overview: () => msg(`Performing security duties.`),
  },
};
