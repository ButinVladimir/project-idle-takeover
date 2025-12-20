import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IActivityState } from '@state/activity-state';
import { type IClonesState } from '@state/clones-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { IExperienceGrowthState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ExperienceGrowthState implements IExperienceGrowthState {
  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  private _recalculated: boolean;
  private _growthByCloneId: Map<string, number>;

  constructor() {
    this._recalculated = false;
    this._growthByCloneId = new Map<string, number>();
  }

  resetValues(): void {
    this._recalculated = false;
  }

  clearValues(): void {
    this._growthByCloneId.clear();
  }

  getGrowthByClone(cloneId: string): number {
    this.recalculate();

    return this._growthByCloneId.get(cloneId) ?? 0;
  }

  private recalculate() {
    if (this._recalculated) {
      return;
    }

    this._recalculated = true;

    for (const clone of this._clonesState.ownedClones.listClones()) {
      this._growthByCloneId.set(clone.id, 0);
    }

    this.updateGrowthBySidejobs();
    this.updateGrowthByPrimaryActivity();
    this.updateGrowthBySharing();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejobActivity of this._activityState.sidejobsActivity.listActivities()) {
      const cloneId = sidejobActivity.sidejob.assignedClone.id;
      let currentGrowth = this._growthByCloneId.get(cloneId) ?? 0;
      currentGrowth += sidejobActivity.getParameterGrowth(DistrictTypeRewardParameter.experience);
      this._growthByCloneId.set(cloneId, currentGrowth);
    }
  }

  private updateGrowthByPrimaryActivity(): void {
    for (const primaryActivity of this._activityState.primaryActivityQueue.listActivities()) {
      for (const clone of primaryActivity.assignedClones) {
        const cloneId = clone.id;
        let currentGrowth = this._growthByCloneId.get(cloneId) ?? 0;
        currentGrowth += primaryActivity.getParameterGrowth(DistrictTypeRewardParameter.experience);
        this._growthByCloneId.set(cloneId, currentGrowth);
      }
    }
  }

  private updateGrowthBySharing(): void {
    let sharedExperience = 0;

    for (const clone of this._clonesState.ownedClones.listClones()) {
      sharedExperience += this._growthByCloneId.get(clone.id) ?? 0;
    }

    sharedExperience *= this._globalState.experienceShare.totalMultiplier;

    for (const clone of this._clonesState.ownedClones.listClones()) {
      const currentExperience = this._growthByCloneId.get(clone.id) ?? 0;

      this._growthByCloneId.set(clone.id, currentExperience + sharedExperience);
    }
  }
}
