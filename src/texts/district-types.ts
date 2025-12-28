import { msg } from '@lit/localize';

export const DISTRICT_TYPE_TEXTS: Record<
  string,
  {
    title: () => string;
    overview: () => string;
  }
> = {
  residential: {
    title: () => msg('Residential district'),
    overview: () => msg(`Relatively silent arrays of houses. Residential districts don't have a lot of opportunities.`),
  },
  corpoPlaza: {
    title: () => msg('Corpo plaza'),
    overview: () =>
      msg(`Corpo plazas house offices of corporations from entire world.
They can always provide a job but refuse to cooperate and share their secrets.`),
  },
};
