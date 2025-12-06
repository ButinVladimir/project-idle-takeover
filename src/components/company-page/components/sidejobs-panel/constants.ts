import { msg } from '@lit/localize';
import { SidejobValidationResult } from '@state/activity-state';

export const SIDEJOB_VALIDATION_TEXTS: Record<SidejobValidationResult, () => string> = {
  [SidejobValidationResult.activityLocked]: () => msg('Sidejob is locked'),
  [SidejobValidationResult.districtLocked]: () => msg('District is locked'),
  [SidejobValidationResult.requirementsNotMet]: () => msg(`Clone doesn't fit requirements`),
  [SidejobValidationResult.notEnoughConnectivity]: () => msg('Not enough connectivity'),
  [SidejobValidationResult.valid]: () => msg('Sidejob is valid'),
};
