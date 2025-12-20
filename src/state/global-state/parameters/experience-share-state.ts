import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { type ICityState } from '@state/city-state';
import { OtherProgramName, PeerReviewerProgram, type IMainframeState } from '@state/mainframe-state';
import { type IScenarioState } from '@state/scenario-state';
import { type IUnlockState } from '@state/unlock-state';
import { Milestone } from '@shared/index';
import { IExperienceShareState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ExperienceShareState implements IExperienceShareState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  private _synchronizationMultiplier: number;
  private _programMultiplier: number;
  private _totalMultiplier: number;
  private _sharedExperience: number;

  constructor() {
    this._synchronizationMultiplier = 0;
    this._programMultiplier = 0;
    this._totalMultiplier = 0;
    this._sharedExperience = 0;
  }

  get baseMultiplier() {
    return this._scenarioState.currentValues.startingValues.experienceShareMultiplier;
  }

  get synchronizationMultiplier() {
    return this._synchronizationMultiplier;
  }

  get programMultiplier() {
    return this._programMultiplier;
  }

  get totalMultiplier() {
    return this._totalMultiplier;
  }

  get sharedExperience() {
    return this._sharedExperience;
  }

  resetExperience() {
    this._sharedExperience = 0;
  }

  increaseExperience(delta: number): void {
    this._sharedExperience += delta * this._totalMultiplier;
  }

  recalculate(): void {
    if (!this.isMilestoneReached()) {
      this._synchronizationMultiplier = 0;
      this._programMultiplier = 0;
      this._totalMultiplier = 0;

      return;
    }

    this._totalMultiplier = this.baseMultiplier;

    this.updateSynchronizationMultiplier();
    this.updateProgramMultiplier();
    this.updateDistrictMultipliers();
  }

  private isMilestoneReached(): boolean {
    return this._unlockState.milestones.isMilestoneReached(Milestone.unlockedExperienceShare);
  }

  private updateSynchronizationMultiplier() {
    this._synchronizationMultiplier = Math.max(
      this._globalState.synchronization.availableValue / this._globalState.synchronization.totalValue,
      0,
    );

    this._totalMultiplier *= this._synchronizationMultiplier;
  }

  private updateProgramMultiplier() {
    let programMultiplier = 1;

    const peerReviewerProcess = this._mainframeState.processes.getProcessByName(OtherProgramName.peerReviewer);

    if (peerReviewerProcess?.enabled) {
      programMultiplier = (peerReviewerProcess.program as PeerReviewerProgram).calculateExperienceShareMultiplier(
        peerReviewerProcess.usedCores,
        peerReviewerProcess.totalRam,
      );
    }

    this._programMultiplier = programMultiplier;
    this._totalMultiplier *= this._programMultiplier;
  }

  private updateDistrictMultipliers() {
    for (const district of this._cityState.listAvailableDistricts()) {
      district.parameters.experienceShareMultiplier.recalculate();

      this._totalMultiplier *= district.parameters.experienceShareMultiplier.value;
    }
  }
}
