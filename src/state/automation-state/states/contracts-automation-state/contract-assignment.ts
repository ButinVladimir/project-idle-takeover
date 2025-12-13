import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { ContractValidationResult, type IActivityState, IContract } from '@state/activity-state';
import { ISerializedContractAssignment, IContractAssignment, IContractAssignmentArguments } from './interfaces';

const { lazyInject } = decorators;

export class ContractAssignment implements IContractAssignment {
  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _id: string;
  private _contract: IContract;
  private _active: boolean;

  constructor(args: IContractAssignmentArguments) {
    this._id = args.id;
    this._contract = args.contract;
    this._active = args.active;

    this._stateUiConnector.registerEventEmitter(this, ['_contract', '_active']);
  }

  get id() {
    return this._id;
  }

  get contract() {
    return this._contract;
  }

  set contract(value: IContract) {
    this._contract = value;
  }

  get active() {
    return this._active;
  }

  canBeStarted(): boolean {
    return (
      !this._activityState.primaryActivityQueue.getActivityByAssignmentId(this._id) &&
      this._contract.district.counters.contracts.getAvailableAmount(this._contract.contractName) > 0 &&
      this._activityState.contractActivityValidator.validate(this._contract) === ContractValidationResult.valid
    );
  }

  start(): void {
    if (!this.canBeStarted()) {
      return;
    }

    this._activityState.primaryActivityQueue.addActivity({
      assignmentId: this._id,
      type: 'contract',
    });
  }

  toggleActive(active: boolean): void {
    this._active = active;
  }

  serialize(): ISerializedContractAssignment {
    return {
      id: this._id,
      contract: this._contract.serialize(),
      active: this._active,
    };
  }

  removeAllEventListeners(): void {
    this._stateUiConnector.unregisterEventEmitter(this);
  }
}
