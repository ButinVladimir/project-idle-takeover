import { inject, injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { ContractsBatchValidationResult, ISerializedContract, type IActivityState } from '@state/activity-state';
import { type IMessageLogState } from '@state/message-log-state';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { ContractsEvent, moveElementInArray, removeElementsFromArray } from '@shared/index';
import { CONTRACT_TEXTS, DISTRICT_NAMES } from '@texts/index';
import {
  ISerializedContractAssignment,
  IContractAssignment,
  IContractsAutomationSerializedState,
  IContractsAutomationState,
  type IContractAssignmentsStarter,
} from './interfaces';
import { ContractAssignment } from './contract-assignment';

const { lazyInject } = decorators;

@injectable()
export class ContractsAutomationState implements IContractsAutomationState {
  @inject(TYPES.ContractAssignmentsStarter)
  private _contractAssignmentStarter!: IContractAssignmentsStarter;

  @lazyInject(TYPES.ActivityState)
  private _activityState!: IActivityState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  private _contractAssignmentsList: IContractAssignment[];
  private _contractAssignmentsIdMap: Map<string, IContractAssignment>;

  constructor() {
    this._contractAssignmentsList = [];
    this._contractAssignmentsIdMap = new Map<string, IContractAssignment>();

    this._stateUiConnector.registerEventEmitter(this, ['_contractAssignmentsList', '_contractAssignmentsIdMap']);
  }

  get starter() {
    return this._contractAssignmentStarter;
  }

  listContractAssignments(): IContractAssignment[] {
    return this._contractAssignmentsList;
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

    return this._contractAssignmentsList[existingAutomationIndex];
  }

  addContractAssignments(contractNames: string[], districts: IDistrictState[], clones: IClone[]): boolean {
    if (
      this._activityState.contractActivityValidator.validateContractsBatch(contractNames, districts, clones) !==
      ContractsBatchValidationResult.valid
    ) {
      return false;
    }

    const districtIndexes = districts.map((district) => district.index);
    const cloneIds = clones.map((clone) => clone.id);

    for (const contractName of contractNames) {
      for (const districtIndex of districtIndexes) {
        this.addContractAssignment(contractName, districtIndex, cloneIds);
      }
    }

    return true;
  }

  removeContractAssignmentById(id: string): void {
    const contractAssignment = this.getContractAssignmentById(id);

    if (contractAssignment) {
      this.handleRemoveContractAssignment(contractAssignment);

      this._messageLogState.postMessage(
        ContractsEvent.contractAssignmentRemoved,
        msg(
          str`Contract assignment for contract "${CONTRACT_TEXTS[contractAssignment.contract.contractName].title()}" in district "${DISTRICT_NAMES[contractAssignment.contract.district.name]()}" has been removed`,
        ),
      );
    }
  }

  removeContractAssignmentsByIds(ids: string[]): void {
    for (const id of ids) {
      const contractAssignment = this.getContractAssignmentById(id);

      if (contractAssignment) {
        this.handleRemoveContractAssignment(contractAssignment);
      }
    }

    this._messageLogState.postMessage(
      ContractsEvent.displayedContractAssignmentsRemoved,
      msg('Displayed contract assignments have been removed'),
    );
  }

  removeCloneFromAssignments(cloneId: string): void {
    for (const contractAssignment of this._contractAssignmentsList) {
      if (!contractAssignment.contract.assignedClones.some((clone) => clone.id === cloneId)) {
        continue;
      }

      const contractArgs = contractAssignment.contract.serialize();
      contractArgs.assignedCloneIds = contractArgs.assignedCloneIds.filter(
        (existingCloneId) => existingCloneId !== cloneId,
      );
      contractAssignment.contract = this._activityState.contractsFactory.makeContract(contractArgs);

      const activity = this._activityState.primaryActivityQueue.getActivityByAssignmentId(contractAssignment.id);

      if (activity) {
        activity.abortCurrentCompletion();
      }
    }
  }

  moveContractAssignment(id: string, nextPosition: number): void {
    const currentPosition = this.getContactAutomationIndexById(id);

    if (currentPosition !== -1) {
      moveElementInArray(this._contractAssignmentsList, currentPosition, nextPosition);
    }
  }

  async startNewState(): Promise<void> {
    this.clearAssignments();
  }

  async deserialize(serializedState: IContractsAutomationSerializedState): Promise<void> {
    this.clearAssignments();

    serializedState.contractAssignments.forEach((serializedContractAssignment) => {
      const contractAssignment = this.makeContractAssignment(serializedContractAssignment);
      this._contractAssignmentsList.push(contractAssignment);
      this._contractAssignmentsIdMap.set(contractAssignment.id, contractAssignment);
    });
  }

  serialize(): IContractsAutomationSerializedState {
    return {
      contractAssignments: this._contractAssignmentsList.map((contractAutomationState) =>
        contractAutomationState.serialize(),
      ),
    };
  }

  private getContactAutomationIndexById(id: string): number {
    return this._contractAssignmentsList.findIndex((contractAutomationState) => contractAutomationState.id === id);
  }

  private getContactAutomationIndexByDistrictAndContract(districtIndex: number, contractName: string): number {
    return this._contractAssignmentsList.findIndex(
      (contractAutomationState) =>
        contractAutomationState.contract.district.index === districtIndex &&
        contractAutomationState.contract.contractName === contractName,
    );
  }

  private clearAssignments() {
    this._contractAssignmentsList.forEach((contractAssignment) => {
      contractAssignment.removeAllEventListeners();
    });

    this._contractAssignmentsList.length = 0;
  }

  private makeContractAssignment(serializedState: ISerializedContractAssignment): IContractAssignment {
    return new ContractAssignment({
      id: serializedState.id,
      contract: this._activityState.contractsFactory.makeContract(serializedState.contract),
      enabled: serializedState.enabled,
    });
  }

  private handleRemoveContractAssignment(contractAssignment: IContractAssignment) {
    const exisitingIndex = this.getContactAutomationIndexById(contractAssignment.id);

    if (exisitingIndex !== -1) {
      removeElementsFromArray(this._contractAssignmentsList, exisitingIndex, 1);
    }

    this._contractAssignmentsIdMap.delete(contractAssignment.id);
    contractAssignment.removeAllEventListeners();

    this._activityState.primaryActivityQueue.cancelActivitiesByAssignmentId(contractAssignment.id);
  }

  private addContractAssignment(contractName: string, districtIndex: number, cloneIds: string[]): void {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(districtIndex, contractName);

    let contractAssignment: IContractAssignment;

    const contractData: ISerializedContract = {
      contractName,
      districtIndex,
      assignedCloneIds: cloneIds,
    };

    if (existingAutomationIndex === -1) {
      contractAssignment = this.makeContractAssignment({
        id: uuid(),
        contract: contractData,
        enabled: true,
      });

      this._contractAssignmentsList.push(contractAssignment);
      this._contractAssignmentsIdMap.set(contractAssignment.id, contractAssignment);
    } else {
      contractAssignment = this._contractAssignmentsList[existingAutomationIndex];
      contractAssignment.contract = this._activityState.contractsFactory.makeContract(contractData);

      const activity = this._activityState.primaryActivityQueue.getActivityByAssignmentId(contractAssignment.id);

      if (activity) {
        activity.abortCurrentCompletion();
      }
    }

    this._messageLogState.postMessage(
      ContractsEvent.contractAssigned,
      msg(
        str`Contract assignment for contract "${CONTRACT_TEXTS[contractAssignment.contract.contractName].title()}" in district "${DISTRICT_NAMES[contractAssignment.contract.district.name]()}" has been added`,
      ),
    );
  }
}
