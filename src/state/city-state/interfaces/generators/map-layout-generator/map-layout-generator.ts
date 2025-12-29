import { IMapLayoutGeneratorResult } from './map-layout-generator-result';

export interface IMapLayoutGenerator {
  generate(): Promise<IMapLayoutGeneratorResult>;
}
