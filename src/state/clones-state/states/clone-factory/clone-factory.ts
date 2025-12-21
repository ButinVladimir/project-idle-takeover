import { injectable } from 'inversify';
import { ICloneFactory, IClone, IMakeCloneParameters } from './interfaces';
import { Clone } from './clone';

@injectable()
export class CloneFactory implements ICloneFactory {
  makeClone(parameters: IMakeCloneParameters): IClone {
    const clone = new Clone(parameters);

    return clone;
  }
}
