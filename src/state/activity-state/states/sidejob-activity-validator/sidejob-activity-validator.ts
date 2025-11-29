import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IUnlockState } from '@state/unlock-state';
import { ATTRIBUTES, calculatePower, SKILLS } from '@shared/index';
import { DistrictUnlockState } from '@state/city-state';
import { ISidejob, typedSidejobs } from '../sidejobs-factory';
import { ISidejobActivityValidator } from './interfaces';
import { SidejobValidationResult } from './types';

const { lazyInject } = decorators;

@injectable()
export class SidejobActivtiyValidator implements ISidejobActivityValidator {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  getConnectivityRequirement(sidejobName: string): number {
    return calculatePower(this._globalState.threat.level, typedSidejobs[sidejobName].requirements.connectivity);
  }

  validate(sidejob: ISidejob): SidejobValidationResult {
    if (!this._unlockState.activities.sidejobs.isActivityAvailable(sidejob.sidejobName)) {
      return SidejobValidationResult.activityLocked;
    }

    if (sidejob.district.state === DistrictUnlockState.locked) {
      return SidejobValidationResult.districtLocked;
    }

    const requiredConnectivity = this.getConnectivityRequirement(sidejob.sidejobName);

    if (requiredConnectivity > sidejob.district.parameters.connectivity.totalValue) {
      return SidejobValidationResult.notEnoughConnectivity;
    }

    if (!this.checkRequirements(sidejob)) {
      return SidejobValidationResult.requirementsNotMet;
    }

    return SidejobValidationResult.valid;
  }

  private checkRequirements(sidejob: ISidejob): boolean {
    for (const attribute of ATTRIBUTES) {
      if (sidejob.assignedClone.getTotalAttributeValue(attribute) < sidejob.getAttributeRequirement(attribute)) {
        return false;
      }
    }

    for (const skill of SKILLS) {
      if (sidejob.assignedClone.getTotalSkillValue(skill) < sidejob.getSkillRequirement(skill)) {
        return false;
      }
    }

    return true;
  }
}
