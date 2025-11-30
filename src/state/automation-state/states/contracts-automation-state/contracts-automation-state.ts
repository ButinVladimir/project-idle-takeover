import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IActivityState } from '@state/activity-state';
import { type IMessageLogState } from '@state/message-log-state';
import { ContractsEvent, moveElementInArray, removeElementsFromArray } from '@shared/index';
import {
  IContractAutomationSerializedState,
  IContractAutomationState,
  IContractsAutomationSerializedState,
  IContractsAutomationState,
  IMakeContractAutomationStateArgs,
} from './interfaces';
import { ContractAutomationState } from './contract-automation-state';
import { CONTRACT_TEXTS, DISTRICT_NAMES } from '@/texts';

const { lazyInject } = decorators;

@injectable()
export class ContractsAutomationState implements IContractsAutomationState {
  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _contractPriorities: IContractAutomationState[];
  private _contractPrioritiesMap: Map<string, IContractAutomationState>;

  constructor() {
    this._contractPriorities = [];
    this._contractPrioritiesMap = new Map<string, IContractAutomationState>();

    this._stateUiConnector.registerEventEmitter(this, ['_contractPriorities']);
  }

  listContractPriorities(): IContractAutomationState[] {
    return this._contractPriorities;
  }

  getContractAutomationById(id: string): IContractAutomationState | undefined {
    return this._contractPrioritiesMap.get(id);
  }

  getContractAutomationByDistrictAndContract(
    districtIndex: number,
    contractName: string,
  ): IContractAutomationState | undefined {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(districtIndex, contractName);

    if (existingAutomationIndex === -1) {
      return undefined;
    }

    return this._contractPriorities[existingAutomationIndex];
  }

  addContractAutomation(parameters: IMakeContractAutomationStateArgs): void {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(
      parameters.contract.districtIndex,
      parameters.contract.contractName,
    );

    let newAutomation: IContractAutomationState;

    if (existingAutomationIndex === -1) {
      newAutomation = this.makeContractAutomationState({
        id: uuid(),
        contract: parameters.contract,
        active: true,
      });

      this._contractPriorities.push(newAutomation);
      this._contractPrioritiesMap.set(newAutomation.id, newAutomation);
    } else {
      const oldAutomation = this._contractPriorities[existingAutomationIndex];
      newAutomation = this.makeContractAutomationState({
        id: uuid(),
        contract: parameters.contract,
        active: oldAutomation.active,
      });

      this._contractPriorities[existingAutomationIndex] = newAutomation;
      this._contractPrioritiesMap.set(newAutomation.id, newAutomation);
      oldAutomation.removeAllEventListeners();
    }

    this._messageLogState.postMessage(
      ContractsEvent.contractAssigned,
      msg(
        str`Contract "${CONTRACT_TEXTS[newAutomation.contract.contractName].title()}" assignment in district "${DISTRICT_NAMES[newAutomation.contract.district.name]()}" has been added`,
      ),
    );
  }

  removeContractAutomation(id: string): void {
    const exisitingIndex = this.getContactAutomationIndexById(id);

    if (exisitingIndex !== -1) {
      removeElementsFromArray(this._contractPriorities, exisitingIndex, 1);
    }

    const contractAutomation = this.getContractAutomationById(id);

    if (contractAutomation) {
      this._contractPrioritiesMap.delete(id);
      contractAutomation.removeAllEventListeners();

      this._messageLogState.postMessage(
        ContractsEvent.contractCancelled,
        msg(
          str`Contract "${CONTRACT_TEXTS[contractAutomation.contract.contractName].title()}" assignment in district "${DISTRICT_NAMES[contractAutomation.contract.district.name]()}" has been removed`,
        ),
      );
    }
  }

  removeAllContractAutomations(): void {
    this.clearPriorities();

    this._messageLogState.postMessage(
      ContractsEvent.allContractsCancelled,
      msg('All contract assignments have been removed'),
    );
  }

  moveContractAutomation(id: string, nextPosition: number): void {
    const currentPosition = this.getContactAutomationIndexById(id);

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
      this._contractPriorities.push(this.makeContractAutomationState(contractAutomationSerializedState));
    });
  }

  serialize(): IContractsAutomationSerializedState {
    return {
      contractPriorities: this._contractPriorities.map((contractAutomationState) =>
        contractAutomationState.serialize(),
      ),
    };
  }

  private getContactAutomationIndexById(id: string): number {
    return this._contractPriorities.findIndex((contractAutomationState) => contractAutomationState.id === id);
  }

  private getContactAutomationIndexByDistrictAndContract(districtIndex: number, contractName: string): number {
    return this._contractPriorities.findIndex(
      (contractAutomationState) =>
        contractAutomationState.contract.district.index === districtIndex &&
        contractAutomationState.contract.contractName === contractName,
    );
  }

  private clearPriorities() {
    this._contractPriorities.forEach((contactAutomationState) => {
      contactAutomationState.removeAllEventListeners();
    });

    this._contractPriorities.length = 0;
  }

  private makeContractAutomationState(serializedState: IContractAutomationSerializedState): IContractAutomationState {
    return new ContractAutomationState({
      id: serializedState.id,
      contract: this._activityState.contractsFactory.makeContract(serializedState.contract),
      active: serializedState.active,
    });
  }
}
