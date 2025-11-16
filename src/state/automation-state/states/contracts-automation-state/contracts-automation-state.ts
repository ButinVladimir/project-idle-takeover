import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { moveElementInArray, removeElementsFromArray } from '@shared/index';
import { IContractAutomationState, IContractsAutomationSerializedState, IContractsAutomationState } from './interfaces';
import { ContractAutomationState } from './contract-automation-state';

const { lazyInject } = decorators;

@injectable()
export class ContractsAutomationState implements IContractsAutomationState {
  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _contractPriorities: IContractAutomationState[];

  constructor() {
    this._contractPriorities = [];

    this._stateUiConnector.registerEventEmitter(this, ['_contractPriorities']);
  }

  listContractPriorities(): IContractAutomationState[] {
    return this._contractPriorities;
  }

  addContractAutomation(contractName: string, districtIndex: number): void {
    const exisitingIndex = this.getContactAutomationIndex(contractName, districtIndex);

    if (exisitingIndex === -1) {
      this._contractPriorities.push(
        new ContractAutomationState({
          contractName,
          districtIndex,
          active: true,
        }),
      );
    }
  }

  removeContractAutonation(contractName: string, districtIndex: number): void {
    const exisitingIndex = this.getContactAutomationIndex(contractName, districtIndex);

    if (exisitingIndex !== -1) {
      removeElementsFromArray(this._contractPriorities, exisitingIndex, 1);
    }
  }

  moveContractAutomation(contractName: string, districtIndex: number, nextPosition: number): void {
    const currentPosition = this.getContactAutomationIndex(contractName, districtIndex);

    if (currentPosition !== -1) {
      moveElementInArray(this._contractPriorities, currentPosition, nextPosition);
    }
  }

  toggleActiveAll(active: boolean): void {
    this._contractPriorities.forEach((contractAutomationState) => {
      contractAutomationState.toggleActive(active);
    });
  }

  repeatAll(): void {
    throw new Error('Method not implemented.');
  }

  async startNewState(): Promise<void> {
    this.clearPriorities();
  }

  async deserialize(serializedState: IContractsAutomationSerializedState): Promise<void> {
    this.clearPriorities();

    serializedState.contractPriorities.forEach((contractAutomationSerializedState) => {
      this._contractPriorities.push(new ContractAutomationState(contractAutomationSerializedState));
    });
  }

  serialize(): IContractsAutomationSerializedState {
    return {
      contractPriorities: this._contractPriorities.map((contractAutomationState) =>
        contractAutomationState.serialize(),
      ),
    };
  }

  private getContactAutomationIndex(contractName: string, districtIndex: number): number {
    return this._contractPriorities.findIndex(
      (contractAutomationState) =>
        contractAutomationState.contractName === contractName &&
        contractAutomationState.districtIndex === districtIndex,
    );
  }

  private clearPriorities() {
    this._contractPriorities.forEach((contactAutomationState) => {
      contactAutomationState.removeAllEventListeners();
    });

    this._contractPriorities.length = 0;
  }
}
