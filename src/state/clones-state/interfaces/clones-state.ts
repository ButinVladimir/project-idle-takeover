import { ISerializeable } from '@shared/index';
import { IOwnedClonesState, ICloneFactory } from '../states';
import { IClonesSerializedState } from './clones-serialized-state';

export interface IClonesState extends ISerializeable<IClonesSerializedState> {
  ownedClones: IOwnedClonesState;
  cloneFactory: ICloneFactory;
  recalculate(): void;
}
