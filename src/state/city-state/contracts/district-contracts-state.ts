import {
  IDistrictContractsCountersState,
  IDistrictContractsSerializedState,
  IDistrictContractsState,
  IDistrictContractsTeamsState,
  IDistrictState,
} from '../interfaces';
import { DistrictContractsCountersState } from './district-contracts-counters-state';
import { DistrictContractsTeamsState } from './district-contracts-teams-state';

export class DistrictContractsState implements IDistrictContractsState {
  private _counters: IDistrictContractsCountersState;
  private _teams: IDistrictContractsTeamsState;

  private _districtState: IDistrictState;

  constructor(districtState: IDistrictState) {
    this._districtState = districtState;

    this._counters = new DistrictContractsCountersState(this._districtState);
    this._teams = new DistrictContractsTeamsState(this._districtState);
  }

  get counters(): IDistrictContractsCountersState {
    return this._counters;
  }

  get teams(): IDistrictContractsTeamsState {
    return this._teams;
  }

  processTick(): void {
    this._counters.processTick();
  }

  serialize(): IDistrictContractsSerializedState {
    return {
      counters: this._counters.serialize(),
      teams: this._teams.serialize(),
    };
  }

  deserialize(serializedState: IDistrictContractsSerializedState): void {
    this._counters.deserialize(serializedState.counters);
    this._teams.deserialize(serializedState.teams);
  }

  removeAllEventListeners() {
    this._counters.removeAllEventListeners();
  }
}
