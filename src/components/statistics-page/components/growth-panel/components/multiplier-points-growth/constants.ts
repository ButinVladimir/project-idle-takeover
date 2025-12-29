import { msg } from '@lit/localize';
import type { PointsMultiplierType } from '@shared/types';

export const MULTIPLIER_POINT_GROWTH_TITLES: Record<PointsMultiplierType, () => string> = {
  codeBase: () => msg('Code base points per second'),
  computationalBase: () => msg('Computational base points per second'),
};
