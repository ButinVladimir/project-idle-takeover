import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { OtherProgramName, PeerReviewerProgram, type IMainframeState } from '@state/mainframe-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { Feature } from '@shared/index';
import { IExperienceShareState } from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class ExperienceShareState implements IExperienceShareState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _synchronizationMultiplier: number;
  private _programMultiplier: number;
  private _totalMultiplier: number;
  private _sharedExperience: number;
  private _recalculationRequested: boolean;

  constructor() {
    this._synchronizationMultiplier = 0;
    this._programMultiplier = 0;
    this._totalMultiplier = 0;
    this._sharedExperience = 0;
    this._recalculationRequested = true;

    this._stateUiConnector.registerEventEmitter(this, [
      '_synchronizationMultiplier',
      '_programMultiplier',
      '_totalMultiplier',
    ]);
  }

  get baseMultiplier() {
    return this._globalState.scenario.currentValues.baseSharedExperienceMultiplier;
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

  requestRecalculation() {
    this._recalculationRequested = true;
  }

  recalculate(): void {
    if (!this._recalculationRequested) {
      return;
    }

    this._recalculationRequested = false;

    if (!this.isFeatureAvailable()) {
      this._synchronizationMultiplier = 0;
      this._programMultiplier = 0;
      this._totalMultiplier = 0;

      return;
    }

    this.calculateSynchronizationMultiplier();
    this.calculateProgramMultiplier();

    this._totalMultiplier = this.baseMultiplier * this._synchronizationMultiplier * this._programMultiplier;
  }

  private isFeatureAvailable(): boolean {
    return this._globalState.unlockedFeatures.isFeatureUnlocked(Feature.experienceShare);
  }

  private calculateSynchronizationMultiplier() {
    this._synchronizationMultiplier = Math.max(
      this._globalState.synchronization.availableValue / this._globalState.synchronization.totalValue,
      0,
    );
  }

  private calculateProgramMultiplier() {
    let programMultiplier = 1;

    const peerReviewerProcess = this._mainframeState.processes.getProcessByName(OtherProgramName.peerReviewer);

    if (peerReviewerProcess?.isActive) {
      programMultiplier = (peerReviewerProcess.program as PeerReviewerProgram).calculateExperienceShareMultiplier(
        peerReviewerProcess.usedCores,
        peerReviewerProcess.totalRam,
      );
    }

    this._programMultiplier = programMultiplier;
  }
}
