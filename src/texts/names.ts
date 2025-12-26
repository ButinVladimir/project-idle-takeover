import { msg } from '@lit/localize';

export const CLONE_NAMES: Record<string, () => string> = {
  John: () => msg('John'),
  Jack: () => msg('Jack'),
  Ivan: () => msg('Ivan'),
  Vasily: () => msg('Vasily'),
  Petar: () => msg('Petar'),
  Miloš: () => msg('Miloš'),
};

export const DISTRICT_NAMES: Record<string, () => string> = {
  Barajevo: () => msg('Barajevo'),
  Čukarica: () => msg('Čukarica'),
  Grocka: () => msg('Grocka'),
  Lazarevac: () => msg('Lazarevac'),
  Mladenovac: () => msg('Mladenovac'),
  'Novi Beograd': () => msg('Novi Beograd'),
  Obrenovac: () => msg('Obrenovac'),
  Palilula: () => msg('Palilula'),
  Rakovica: () => msg('Rakovica'),
  'Savski Venac': () => msg('Savski Venac'),
  Sopot: () => msg('Sopot'),
  'Stari Grad': () => msg('Stari Grad'),
  Surčin: () => msg('Surčin'),
  Voždovac: () => msg('Voždovac'),
  Vračar: () => msg('Vračar'),
  Zemun: () => msg('Zemun'),
  Zvezdara: () => msg('Zvezdara'),
};
