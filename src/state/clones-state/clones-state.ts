import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { IClonesSerializedState, IClonesState } from './interfaces';
import { type IOwnedClonesState, type ICloneFactory } from './states';

@injectable()
export class ClonesState implements IClonesState {
  @inject(TYPES.OwnedClonesState)
  private _ownedClones!: IOwnedClonesState;

  @inject(TYPES.CloneFactory)
  private _cloneFactory!: ICloneFactory;

  get ownedClones() {
    return this._ownedClones;
  }

  get cloneFactory() {
    return this._cloneFactory;
  }

  recalculate() {
    this._ownedClones.recalculateClones();
  }

  async startNewState(): Promise<void> {
    await this._ownedClones.startNewState();
  }

  async deserialize(serializedState: IClonesSerializedState): Promise<void> {
    await this._ownedClones.deserialize(serializedState.ownedClones);
  }

  serialize(): IClonesSerializedState {
    return {
      ownedClones: this._ownedClones.serialize(),
    };
  }
}
