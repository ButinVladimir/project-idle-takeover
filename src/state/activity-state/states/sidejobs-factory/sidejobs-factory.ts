import { decorators } from '@state/container';
import { TYPES } from '@state/types';
import { type ICityState } from '@state/city-state';
import { type IClonesState } from '@state/clones-state';
import { ISerializedSidejob, ISidejob, ISidejobsFactory } from './interfaces';
import { injectable } from 'inversify';
import { Sidejob } from './sidejob';

const { lazyInject } = decorators;

@injectable()
export class SidejobsFactory implements ISidejobsFactory {
  @lazyInject(TYPES.CityState)
  private _cityState!: ICityState;

  @lazyInject(TYPES.ClonesState)
  private _clonesState!: IClonesState;

  makeSidejob(sidejobArgs: ISerializedSidejob): ISidejob {
    return new Sidejob({
      sidejobName: sidejobArgs.sidejobName,
      district: this._cityState.getDistrictState(sidejobArgs.districtIndex),
      assignedClone: this._clonesState.ownedClones.getCloneById(sidejobArgs.assignedCloneId)!,
    });
  }
}
