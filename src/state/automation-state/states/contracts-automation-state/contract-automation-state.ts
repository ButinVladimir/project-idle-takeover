import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IContract } from '@state/activity-state';
import {
  IContractAutomationSerializedState,
  IContractAutomationState,
  IContractAutomationStateArguments,
} from './interfaces';

const { lazyInject } = decorators;

export class ContractAutomationState implements IContractAutomationState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _id: string;
  private _contract: IContract;
  private _active: boolean;

  constructor(args: IContractAutomationStateArguments) {
    this._id = args.id;
    this._contract = args.contract;
    this._active = args.active;

    this._stateUiConnector.registerEventEmitter(this, ['_active']);
  }

  get id() {
    return this._id;
  }

  get contract() {
    return this._contract;
  }

  get active() {
    return this._active;
  }

  canBeRepeated(): boolean {
    throw new Error('Method not implemented.');
  }

  toggleActive(active: boolean): void {
    this._active = active;
  }

  serialize(): IContractAutomationSerializedState {
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
