import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { DistrictTypeRewardParameter, Milestone, NotificationType, MILESTONES } from '@shared/index';
import type { IStateUIConnector } from '@state/state-ui-connector';
import type { INotificationsState } from '@state/notifications-state';
import { FactionPlaystyle, type IFactionState } from '@state/faction-state';
import { TYPES } from '@state/types';
import { MILESTONE_TEXTS } from '@texts/index';
import { IReachedMilestonesSerializedState, IReachedMilestonesState } from './interfaces';
import { msg } from '@lit/localize';

const { lazyInject } = decorators;

@injectable()
export class ReachedMilestonesState implements IReachedMilestonesState {
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
    if (this.isMilestoneReached(milestone)) {
      return false;
    }

    this._unlockedMilestones.add(milestone);

    this._notificationsState.pushNotification(NotificationType.milestoneReached, MILESTONE_TEXTS[milestone].message());

    if (this._unlockedMilestones.size >= MILESTONES.length) {
      this._notificationsState.pushNotification(
        NotificationType.allMilestonesReached,
        msg('All milestones have been reached. Thank you for playing.'),
        true,
      );
    }

    return true;
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
          this._factionState.currentFactionValues.playstyle === FactionPlaystyle.captureCity &&
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
