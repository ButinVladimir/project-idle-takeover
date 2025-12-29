import { msg } from '@lit/localize';
import type { PointsMultiplierType } from '@shared/types';

export const MULTIPLIER_POINT_TITLES: Record<PointsMultiplierType, () => string> = {
  codeBase: () => msg('Code base points'),
  computationalBase: () => msg('Computational base points'),
};
