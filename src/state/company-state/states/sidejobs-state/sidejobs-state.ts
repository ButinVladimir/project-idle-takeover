import { v4 as uuid } from 'uuid';
import { msg, str } from '@lit/localize';
import { calculatePower, removeElementsFromArray, SidejobsEvent } from '@shared/index';
import { decorators } from '@state/container';
import { type IGlobalState } from '@state/global-state';
import { DistrictUnlockState, type ICityState } from '@state/city-state';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IMessageLogState } from '@state/message-log-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import { DISTRICT_NAMES, SIDEJOB_TEXTS } from '@texts/index';
import { type ICompanyState } from '../../interfaces';
import {
  ISidejob,
  IMakeSidejobParameters,
  ICompanySidejobsSerializedState,
  ICompanySidejobsState,
  IAssignSidejobArguments,
  ISerializedSidejob,
} from './interfaces';
import { Sidejob } from './sidejob';
import { typedSidejobs } from './constants';

const { lazyInject } = decorators;

export class CompanySidejobsState implements ICompanySidejobsState {
  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.CompanyState)
  private _companyState!: ICompanyState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUIConnector!: IStateUIConnector;

  private _sidejobsList: ISidejob[];
  private _sidejobCloneIdMap: Map<string, ISidejob>;
  private _sidejobMap: Map<string, ISidejob>;

  constructor() {
    this._sidejobsList = [];
    this._sidejobCloneIdMap = new Map<string, ISidejob>();
    this._sidejobMap = new Map<string, ISidejob>();

    this._stateUIConnector.registerEventEmitter(this, ['_sidejobsList']);
  }

  getConnectivityRequirement(sidejobName: string): number {
    return calculatePower(this._globalState.threat.level, typedSidejobs[sidejobName].requirements.connectivity);
  }

  listSidejobs(): ISidejob[] {
    return this._sidejobsList;
  }

  getSidejobByCloneId(cloneId: string): ISidejob | undefined {
    return this._sidejobCloneIdMap.get(cloneId);
  }

  getSidejobById(sidejobId: string): ISidejob | undefined {
    return this._sidejobMap.get(sidejobId);
  }

  makeSidejob(sidejobParameters: IMakeSidejobParameters): ISidejob {
    return new Sidejob({
      id: sidejobParameters.id,
      assignedClone: sidejobParameters.assignedCloneId
        ? this._companyState.clones.getCloneById(sidejobParameters.assignedCloneId)
        : undefined,
      sidejobName: sidejobParameters.sidejobName,
      district: this._cityState.getDistrictState(sidejobParameters.districtIndex),
    });
  }

  assignSidejob(sidejobParameters: IAssignSidejobArguments): boolean {
    if (!sidejobParameters.assignedCloneId) {
      return false;
    }

    if (!this._unlockState.activities.sidejobs.isActivityAvailable(sidejobParameters.sidejobName)) {
      return false;
    }

    const district = this._cityState.getDistrictState(sidejobParameters.districtIndex);

    if (district.state === DistrictUnlockState.locked) {
      return false;
    }

    const connectivity = district.parameters.connectivity.totalValue;
    const requiredConnectivity = this.getConnectivityRequirement(sidejobParameters.sidejobName);

    if (connectivity < requiredConnectivity) {
      return false;
    }

    const sidejob = this.makeSidejob({
      id: uuid(),
      ...sidejobParameters,
    });

    if (!sidejob.checkRequirements()) {
      sidejob.removeAllEventListeners();
      return false;
    }

    this.addSidejob(sidejob);
    this._companyState.requestReassignment();

    this._messageLogState.postMessage(
      SidejobsEvent.sidejobAssigned,
      msg(
        str`Sidejob "${SIDEJOB_TEXTS[sidejob.sidejobName].title()}" in district "${DISTRICT_NAMES[sidejob.district.name]()}" has been assigned to clone "${sidejob.assignedClone!.name}"`,
      ),
    );

    return true;
  }

  cancelSidejob(sidejobId: string): void {
    const sidejob = this.getSidejobById(sidejobId);
    const index = this._sidejobsList.findIndex((sidejob) => sidejob.id === sidejobId);

    if (index >= 0) {
      removeElementsFromArray(this._sidejobsList, index, 1);
    }

    if (sidejob) {
      this.handleSidejobCleanup(sidejob);

      this._sidejobMap.delete(sidejobId);
      this._sidejobCloneIdMap.delete(sidejob.assignedClone!.id);

      this._messageLogState.postMessage(
        SidejobsEvent.sidejobCancelled,
        msg(
          str`Sidejob "${SIDEJOB_TEXTS[sidejob.sidejobName].title()}" in district "${DISTRICT_NAMES[sidejob.district.name]()}" assigned to clone "${sidejob.assignedClone!.name}" has been cancelled`,
        ),
      );
    }

    this._companyState.requestReassignment();
  }

  cancelAllSidejobs(): void {
    this.clearSidejobs();

    this._messageLogState.postMessage(SidejobsEvent.allSidejobsCancelled, msg('All sidejobs have been cancelled'));
  }

  updateAllSidejobsPerformance(): void {
    for (const sidejob of this._sidejobsList) {
      if (sidejob.isActive) {
        sidejob.handlePerformanceUpdate();
      }
    }
  }

  perform(): void {
    for (const sidejob of this._sidejobsList) {
      if (sidejob.isActive) {
        sidejob.perform();
      }
    }
  }

  filterSidejobs(): void {
    const sidejobsToDelete: Set<ISidejob> = new Set<ISidejob>();

    for (const sidejob of this._sidejobsList) {
      if (!sidejob.checkRequirements()) {
        sidejobsToDelete.add(sidejob);
      }
    }

    for (const sidejob of sidejobsToDelete) {
      this.cancelSidejob(sidejob.id);
    }
  }

  async startNewState(): Promise<void> {
    this.clearSidejobs();
  }

  async deserialize(serializedState: ICompanySidejobsSerializedState): Promise<void> {
    this.clearSidejobs();

    serializedState.sidejobs.forEach((serializedSidejob) => {
      const sidejob = this.makeSidejob(serializedSidejob);

      this.addSidejob(sidejob);
    });
  }

  serialize(): ICompanySidejobsSerializedState {
    return {
      sidejobs: this._sidejobsList.map(this.serializeSidejob),
    };
  }

  serializeSidejob = (sidejob: ISidejob): ISerializedSidejob => {
    return sidejob.serialize();
  };

  private addSidejob(sidejob: ISidejob) {
    const existingSidejobByClone = this.getSidejobByCloneId(sidejob.assignedClone!.id);

    if (existingSidejobByClone) {
      this.cancelSidejob(existingSidejobByClone.id);
    }

    this._sidejobsList.push(sidejob);
    this._sidejobMap.set(sidejob.id, sidejob);
    this._sidejobCloneIdMap.set(sidejob.assignedClone!.id, sidejob);
  }

  private clearSidejobs() {
    for (const sidejob of this._sidejobsList) {
      this.handleSidejobCleanup(sidejob);
    }

    this._sidejobsList.length = 0;
    this._sidejobCloneIdMap.clear();
    this._sidejobMap.clear();

    this._companyState.requestReassignment();
  }

  private handleSidejobCleanup(sidejob: ISidejob) {
    sidejob.isActive = false;
    sidejob.handlePerformanceUpdate();
    sidejob.removeAllEventListeners();
  }
}
