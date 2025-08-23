import { msg } from '@lit/localize';
import type { MultipliersType } from '../../types';

export const STATISTIC_MULTIPLIER_TITLES: Record<MultipliersType, () => string> = {
  mainframeHardwareCostDivisors: () => msg('Mainframe hardware cost divisors'),
  mainframeProgramsCostDivisors: () => msg('Mainframe programs cost divisors'),
};
