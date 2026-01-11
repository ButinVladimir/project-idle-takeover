import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IContract } from '@state/activity-state';
import { ISerializedContractAssignment, IContractAssignment, IContractAssignmentArguments } from './interfaces';

const { lazyInject } = decorators;

export class ContractAssignment implements IContractAssignment {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _id: string;
  private _contract: IContract;
  private _enabled: boolean;

  constructor(args: IContractAssignmentArguments) {
    this._id = args.id;
    this._contract = args.contract;
    this._enabled = args.enabled;

    this._stateUiConnector.registerEventEmitter(this, ['_contract', '_enabled']);
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

  get enabled() {
    return this._enabled;
  }

  toggleEnabled(enabled: boolean): void {
    this._enabled = enabled;
  }

  serialize(): ISerializedContractAssignment {
    return {
      id: this._id,
      contract: this._contract.serialize(),
      enabled: this._enabled,
    };
  }

  removeAllEventListeners(): void {
    this._stateUiConnector.unregisterEventEmitter(this);
  }
}
