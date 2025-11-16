import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { IContractAutomationSerializedState, IContractAutomationState } from './interfaces';

const { lazyInject } = decorators;

export class ContractAutomationState implements IContractAutomationState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _contractName: string;
  private _districtIndex: number;
  private _active: boolean;

  constructor(serializedState: IContractAutomationSerializedState) {
    this._contractName = serializedState.contractName;
    this._districtIndex = serializedState.districtIndex;
    this._active = serializedState.active;

    this._stateUiConnector.registerEventEmitter(this, ['_contractName', '_districtIndex', '_active']);
  }

  get contractName() {
    return this._contractName;
  }

  get districtIndex() {
    return this._districtIndex;
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
      contractName: this._contractName,
      districtIndex: this._districtIndex,
      active: this._active,
    };
  }

  removeAllEventListeners(): void {
    this._stateUiConnector.unregisterEventEmitter(this);
  }
}
