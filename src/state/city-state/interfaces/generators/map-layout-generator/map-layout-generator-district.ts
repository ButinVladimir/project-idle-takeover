import { RandomQueue, IPoint } from '@shared/index';

export interface IMapLayoutGeneratorDistrict {
  startingPoint: IPoint;
  queue: RandomQueue<IPoint>;
}
