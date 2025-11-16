import { injectable } from 'inversify';
import { TYPES } from '@state/types';
import { decorators } from '@state/container';
import { IClone, type IClonesState } from '@state/clones-state';
import {
  IDistrictContractsTeamsState,
  IDistrictContractsTeamsSerializedState,
  type IDistrictState,
} from '../interfaces';

const { lazyInject } = decorators;

@injectable()
export class DistrictContractsTeamsState implements IDistrictContractsTeamsState {
  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  private _districtState: IDistrictState;
  private _teams: Map<string, IClone[]>;

  constructor(districtState: IDistrictState) {
    this._districtState = districtState;

    this._teams = new Map<string, IClone[]>();
  }

  getTeam(contractName: string): IClone[] {
    return this._teams.get(contractName) ?? [];
  }

  setTeam(contractName: string, clones: IClone[]) {
    this._teams.set(contractName, clones);
  }

  serialize(): IDistrictContractsTeamsSerializedState {
    return {
      teams: Object.fromEntries(
        Array.from(this._teams.entries()).map(([contractName, clones]) => [
          contractName,
          clones.map((clone) => clone.id),
        ]),
      ),
    };
  }

  deserialize(serializedState: IDistrictContractsTeamsSerializedState): void {
    this._teams.clear();

    Object.entries(serializedState.teams).forEach(([contractName, cloneIds]) => {
      this._teams.set(
        contractName,
        cloneIds.map((cloneId) => {
          const clone = this._clonesState.ownedClones.getCloneById(cloneId);

          if (!clone) {
            throw new Error(`Clone ${cloneId} does not exists`);
          }

          return clone;
        }),
      );
    });
  }
}
