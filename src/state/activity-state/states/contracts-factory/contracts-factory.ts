import { injectable } from 'inversify';
import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type ICityState } from '@state/city-state';
import { type IClonesState } from '@state/clones-state';
import { IContract, IContractsFactory, ISerializedContract } from './interfaces';
import { Contract } from './contract';

const { lazyInject } = decorators;

@injectable()
export class ContractsFactory implements IContractsFactory {
  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  makeContract(contractArgs: ISerializedContract): IContract {
    return new Contract({
      contractName: contractArgs.contractName,
      district: this._cityState.getDistrictState(contractArgs.districtIndex),
      assignedClones: contractArgs.assignedCloneIds.map(
        (cloneId) => this._clonesState.ownedClones.getCloneById(cloneId)!,
      ),
    });
  }
}
