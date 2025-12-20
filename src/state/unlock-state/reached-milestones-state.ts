import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { DistrictTypeRewardParameter, Milestone, NotificationType } from '@shared/types';
import type { IStateUIConnector } from '@state/state-ui-connector/interfaces/state-ui-connector';
import type { INotificationsState } from '@state/notifications-state/interfaces/notifications-state';
import { type IFactionState } from '@state/faction-state';
import { TYPES } from '@state/types';
import { MILESTONE_TEXTS } from '@texts/index';
import { type IUnlockState, IReachedMilestonesSerializedState, IReachedMilestonesState } from './interfaces';

const { lazyInject } = decorators;

@injectable()
export class ReachedMilestonesState implements IReachedMilestonesState {
  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.FactionState)
  private _factionState!: IFactionState;

  @lazyInject(TYPES.NotificationsState)
  private _notificationsState!: INotificationsState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _unlockedMilestones: Set<Milestone>;

  constructor() {
    this._unlockedMilestones = new Set<Milestone>();

    this._stateUiConnector.registerEventEmitter(this, ['_unlockedMilestones']);
  }

  isMilestoneReached(milestone: Milestone): boolean {
    return this._unlockedMilestones.has(milestone);
  }

  reachMilestone(milestone: Milestone) {
    if (!this._unlockedMilestones.has(milestone)) {
      this._unlockedMilestones.add(milestone);

      this._unlockState.requestRecalculation();

      this._notificationsState.pushNotification(
        NotificationType.milestoneReached,
        MILESTONE_TEXTS[milestone].message(),
      );
    }
  }

  listReachedMilestones(): Milestone[] {
    return Array.from(this._unlockedMilestones.values());
  }

  isRewardParameterUnlocked(parameter: DistrictTypeRewardParameter): boolean {
    switch (parameter) {
      case DistrictTypeRewardParameter.money:
      case DistrictTypeRewardParameter.developmentPoints:
      case DistrictTypeRewardParameter.processCompletionSpeed:
        return true;
      case DistrictTypeRewardParameter.experience:
        return this.isMilestoneReached(Milestone.unlockedCompanyManagement);
      case DistrictTypeRewardParameter.connectivity:
        return this.isMilestoneReached(Milestone.unlockedConnectivity);
      case DistrictTypeRewardParameter.influence:
        return (
          this._factionState.currentFactionValues.playstyle === 'captureCity' &&
          this.isMilestoneReached(Milestone.unlockedInfluence)
        );
      case DistrictTypeRewardParameter.rewards:
        return this.isMilestoneReached(Milestone.unlockedRewards);
      case DistrictTypeRewardParameter.codeBase:
        return this.isMilestoneReached(Milestone.unlockedCodeBase);
      case DistrictTypeRewardParameter.computationalBase:
        return this.isMilestoneReached(Milestone.unlockedComputationalBase);
      case DistrictTypeRewardParameter.experienceShareMultiplier:
        return this.isMilestoneReached(Milestone.unlockedExperienceShare);
      default:
        return false;
    }
  }

  async startNewState(): Promise<void> {
    this._unlockedMilestones.clear();
  }

  async deserialize(serializedState: IReachedMilestonesSerializedState): Promise<void> {
    this._unlockedMilestones.clear();

    serializedState.reachedMilestones.forEach((milestone: Milestone) => this._unlockedMilestones.add(milestone));
  }

  serialize(): IReachedMilestonesSerializedState {
    return {
      reachedMilestones: Array.from(this._unlockedMilestones.values()),
    };
  }
}
