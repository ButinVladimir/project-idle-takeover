import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type IGlobalState } from '@state/global-state';
import { type IActivityState } from '@state/activity-state';
import { type IClonesState } from '@state/clones-state';
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
    this.updateGrowthBySharing();
  }

  private updateGrowthBySidejobs(): void {
    for (const sidejob of this._activityState.sidejobs.listSidejobs()) {
      if (!sidejob.isActive) {
        continue;
      }

      let currentGrowth = this._growthByCloneId.get(sidejob.assignedClone!.id) ?? 0;
      currentGrowth += sidejob.calculateExperienceDelta(1);
      this._growthByCloneId.set(sidejob.assignedClone!.id, currentGrowth);
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
