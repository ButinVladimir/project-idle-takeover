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

  private _contractAssignmentsList: IContractAssignment[];
  private _contractAssignmentsIdMap: Map<string, IContractAssignment>;

  constructor() {
    this._contractAssignmentsList = [];
    this._contractAssignmentsIdMap = new Map<string, IContractAssignment>();

    this._stateUiConnector.registerEventEmitter(this, ['_contractAssignmentsList', '_contractAssignmentsIdMap']);
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

  addContractAssignment(parameters: IMakeContractAutomationStateArgs): void {
    const existingAutomationIndex = this.getContactAutomationIndexByDistrictAndContract(
      parameters.contract.districtIndex,
      parameters.contract.contractName,
    );

    let contractAssignment: IContractAssignment;

    if (existingAutomationIndex === -1) {
      contractAssignment = this.makeContractAssignment({
        id: uuid(),
        contract: parameters.contract,
        active: true,
      });

      this._contractAssignmentsList.push(contractAssignment);
      this._contractAssignmentsIdMap.set(contractAssignment.id, contractAssignment);
    } else {
      contractAssignment = this._contractAssignmentsList[existingAutomationIndex];
      contractAssignment.contract = this._activityState.contractsFactory.makeContract(parameters.contract);
    }

    this._messageLogState.postMessage(
      ContractsEvent.contractAssigned,
      msg(
        str`Contract assignment for contract "${CONTRACT_TEXTS[contractAssignment.contract.contractName].title()}" in district "${DISTRICT_NAMES[contractAssignment.contract.district.name]()}" has been added`,
      ),
    );
  }

  removeContractAssignmentById(id: string): void {
    const exisitingIndex = this.getContactAutomationIndexById(id);

    if (exisitingIndex !== -1) {
      removeElementsFromArray(this._contractAssignmentsList, exisitingIndex, 1);
    }

    const contractAssignment = this.getContractAssignmentById(id);

    if (contractAssignment) {
      this._contractAssignmentsIdMap.delete(id);
      contractAssignment.removeAllEventListeners();

      this._activityState.primaryActivityQueue.cancelActivitiesByAssignmentId(id);

      this._messageLogState.postMessage(
        ContractsEvent.contractAssignmentRemoved,
        msg(
          str`Contract assignment for contract "${CONTRACT_TEXTS[contractAssignment.contract.contractName].title()}" in district "${DISTRICT_NAMES[contractAssignment.contract.district.name]()}" has been removed`,
        ),
      );
    }
  }

  removeAllContractAssignments(): void {
    this.clearAssignments();

    this._activityState.primaryActivityQueue.cancelAllActivities();

    this._messageLogState.postMessage(
      ContractsEvent.allContractAssignmentsRemoved,
      msg('All contract assignments have been removed'),
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

  toggleAllContractAssignments(active: boolean): void {
    this._contractAssignmentsList.forEach((contractAssignment) => {
      contractAssignment.toggleActive(active);
    });
  }

  startAll(): void {
    this._contractAssignmentsList.forEach((contractAssignment) => {
      if (contractAssignment.active) {
        contractAssignment.start();
      }
    });
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
    this._contractAssignmentsList.forEach((contactAutomationState) => {
      contactAutomationState.removeAllEventListeners();
    });

    this._contractAssignmentsList.length = 0;
  }

  private makeContractAssignment(serializedState: ISerializedContractAssignment): IContractAssignment {
    return new ContractAssignment({
      id: serializedState.id,
      contract: this._activityState.contractsFactory.makeContract(serializedState.contract),
      active: serializedState.active,
    });
  }
}
