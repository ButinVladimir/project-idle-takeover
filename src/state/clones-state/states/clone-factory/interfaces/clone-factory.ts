import { IClone } from './clone';
import { IMakeCloneParameters } from './make-clone-parameters';

export interface ICloneFactory {
  makeClone(parameters: IMakeCloneParameters): IClone;
}
