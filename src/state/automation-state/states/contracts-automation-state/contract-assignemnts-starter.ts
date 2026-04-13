import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { ContractValidationResult, type IActivityState } from '@state/activity-state';
import { type IUnlockState } from '@state/unlock-state';
import { Milestone } from '@shared/index';
import { IContractAssignment, IContractAssignmentsStarter } from './interfaces';
import { type IAutomationState } from '../../interfaces';

const { lazyInject } = decorators;

export class ContractAssignmentsStarter implements IContractAssignmentsStarter {
  @lazyInject(TYPES.AutomationState)
  private _automationState!: IAutomationState;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  private _availableActions = 0;

  checkContractAssignment(contractAssignment: IContractAssignment): boolean {
    return (
      !this._activityState.primaryActivityQueue.getActivityByAssignmentId(contractAssignment.id) &&
      contractAssignment.contract.district.counters.contracts.getAvailableAmount(
        contractAssignment.contract.contractName,
      ) > 0 &&
      this._activityState.contractActivityValidator.validateContract(contractAssignment.contract) ===
        ContractValidationResult.valid
    );
  }

  startAssignment(contractAssignmentId: string): boolean {
    if (!this.checkStartAvailable()) {
      return false;
    }

    const contractAssignment = this._automationState.contracts.getContractAssignmentById(contractAssignmentId);

    if (!contractAssignment) {
      return false;
    }

    if (!this.checkContractAssignment(contractAssignment)) {
      return false;
    }

    this._availableActions = Number.MAX_SAFE_INTEGER;
    this.performStartAssignment(contractAssignment);

    return true;
  }

  startAssignments(contractAssignmentIds: string[]): boolean {
    if (!this.checkStartAvailable()) {
      return false;
    }

    const contractAssignments = contractAssignmentIds
      .map((contractAssignmentId) => this._automationState.contracts.getContractAssignmentById(contractAssignmentId))
      .filter((contractAssignment) => contractAssignment) as IContractAssignment[];

    this._availableActions = Number.MAX_SAFE_INTEGER;

    this.performStartAssignments(contractAssignments);

    return true;
  }

  autostart(actionCount: number): boolean {
    if (!this.checkStartAvailable()) {
      return false;
    }

    const contractAssignments = this._automationState.contracts.listContractAssignments();

    this._availableActions = actionCount;

    this.performStartAssignments(contractAssignments);

    return true;
  }

  private checkStartAvailable() {
    return this._unlockState.milestones.isMilestoneReached(Milestone.unlockedCompanyManagement);
  }

  private performStartAssignments(contractAssignments: IContractAssignment[]) {
    for (const contractAssignment of contractAssignments) {
      if (this._availableActions <= 0) {
        break;
      }

      if (!contractAssignment.enabled) {
        continue;
      }

      if (!this.checkContractAssignment(contractAssignment)) {
        continue;
      }

      this.performStartAssignment(contractAssignment);
    }
  }

  private performStartAssignment(contractAssignment: IContractAssignment) {
    this._activityState.primaryActivityQueue.addActivity({
      assignmentId: contractAssignment.id,
      type: 'contract',
    });

    this._availableActions--;
  }
}
