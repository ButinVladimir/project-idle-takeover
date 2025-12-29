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
    overview: () => msg(`Perform security duties.`),
  },
  backroomDeal: {
    title: () => msg('Backroom deal'),
    overview: () => msg('Strike a deal to gain advantage.'),
  },
};
