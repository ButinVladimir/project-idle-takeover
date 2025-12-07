import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IActivityState } from '@state/activity-state';
import { type IMessageLogState } from '@state/message-log-state';
import { ContractsEvent, moveElementInArray, removeElementsFromArray } from '@shared/index';
import { CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import {
  ISerializedContractAssignment,
  IContractAssignment,
  IContractsAutomationSerializedState,
  IContractsAutomationState,
  IMakeContractAutomationStateArgs,
} from './interfaces';
import { ContractAssignment } from './contract-assignment';

const { lazyInject } = decorators;

@injectable()
export class ContractsAutomationState implements IContractsAutomationState {
  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _contractAssignments: IContractAssignment[];
  private _contractAssignmentsIdMap: Map<string, IContractAssignment>;

  constructor() {
    this._contractAssignments = [];
    this._contractAssignmentsIdMap = new Map<string, IContractAssignment>();

    this._stateUiConnector.registerEventEmitter(this, ['_contractAssignments']);
  }

  listContractAssignments(): IContractAssignment[] {
    return this._contractAssignments;
  }

  getContractAssignmentById(id: string): IContractAssignment | undefined {
    return this._contractAssignmentsIdMap.get(id);
  }

  getContractAssignmentByDistrictAndContract(
    districtIndex: number,
    contractName: string,
  ): IContractAssignment | undefined {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(districtIndex, contractName);

    if (existingAutomationIndex === -1) {
      return undefined;
    }

    return this._contractAssignments[existingAutomationIndex];
  }

  addContractAssignment(parameters: IMakeContractAutomationStateArgs): void {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(
      parameters.contract.districtIndex,
      parameters.contract.contractName,
    );

    let newAutomation: IContractAssignment;

    if (existingAutomationIndex === -1) {
      newAutomation = this.makeContractAssignment({
        id: uuid(),
        contract: parameters.contract,
        active: true,
      });

      this._contractAssignments.push(newAutomation);
      this._contractAssignmentsIdMap.set(newAutomation.id, newAutomation);
    } else {
      const oldAutomation = this._contractAssignments[existingAutomationIndex];
      newAutomation = this.makeContractAssignment({
        id: uuid(),
        contract: parameters.contract,
        active: oldAutomation.active,
      });

      this._contractAssignments[existingAutomationIndex] = newAutomation;
      this._contractAssignmentsIdMap.set(newAutomation.id, newAutomation);
      this._contractAssignmentsIdMap.delete(oldAutomation.id);
      oldAutomation.removeAllEventListeners();
    }

    this._messageLogState.postMessage(
      ContractsEvent.contractAssigned,
      msg(
        str`Contract assignment for contract "${CONTRACT_TEXTS[newAutomation.contract.contractName].title()}" in district "${DISTRICT_NAMES[newAutomation.contract.district.name]()}" has been added`,
      ),
    );
  }

  removeContractAssignmentById(id: string): void {
    const exisitingIndex = this.getContactAutomationIndexById(id);

    if (exisitingIndex !== -1) {
      removeElementsFromArray(this._contractAssignments, exisitingIndex, 1);
    }

    const contractAutomation = this.getContractAssignmentById(id);

    if (contractAutomation) {
      this._contractAssignmentsIdMap.delete(id);
      contractAutomation.removeAllEventListeners();

      this._messageLogState.postMessage(
        ContractsEvent.contractAssignmentRemoved,
        msg(
          str`Contract assignment for contract "${CONTRACT_TEXTS[contractAutomation.contract.contractName].title()}" in district "${DISTRICT_NAMES[contractAutomation.contract.district.name]()}" has been removed`,
        ),
      );
    }
  }

  removeAllContractAssignments(): void {
    this.clearAssignments();

    this._messageLogState.postMessage(
      ContractsEvent.allContractAssignmentsRemoved,
      msg('All contract assignments have been removed'),
    );
  }

  moveContractAssignment(id: string, nextPosition: number): void {
    const currentPosition = this.getContactAutomationIndexById(id);

    if (currentPosition !== -1) {
      moveElementInArray(this._contractAssignments, currentPosition, nextPosition);
    }
  }

  toggleAllContractAssignments(active: boolean): void {
    this._contractAssignments.forEach((contractAssignment) => {
      contractAssignment.toggleActive(active);
    });
  }

  repeatAll(): void {
    throw new Error('Method not implemented.');
  }

  async startNewState(): Promise<void> {
    this.clearAssignments();
  }

  async deserialize(serializedState: IContractsAutomationSerializedState): Promise<void> {
    this.clearAssignments();

    serializedState.contractAssignments.forEach((serializedContractAssignment) => {
      const contractAssignment = this.makeContractAssignment(serializedContractAssignment);
      this._contractAssignments.push(contractAssignment);
      this._contractAssignmentsIdMap.set(contractAssignment.id, contractAssignment);
    });
  }

  serialize(): IContractsAutomationSerializedState {
    return {
      contractAssignments: this._contractAssignments.map((contractAutomationState) =>
        contractAutomationState.serialize(),
      ),
    };
  }

  private getContactAutomationIndexById(id: string): number {
    return this._contractAssignments.findIndex((contractAutomationState) => contractAutomationState.id === id);
  }

  private getContactAutomationIndexByDistrictAndContract(districtIndex: number, contractName: string): number {
    return this._contractAssignments.findIndex(
      (contractAutomationState) =>
        contractAutomationState.contract.district.index === districtIndex &&
        contractAutomationState.contract.contractName === contractName,
    );
  }

  private clearAssignments() {
    this._contractAssignments.forEach((contactAutomationState) => {
      contactAutomationState.removeAllEventListeners();
    });

    this._contractAssignments.length = 0;
  }

  private makeContractAssignment(serializedState: ISerializedContractAssignment): IContractAssignment {
    return new ContractAssignment({
      id: serializedState.id,
      contract: this._activityState.contractsFactory.makeContract(serializedState.contract),
      active: serializedState.active,
    });
  }
}
