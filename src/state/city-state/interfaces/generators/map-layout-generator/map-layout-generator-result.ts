import { IMapLayoutGeneratorDistrictResult } from './map-layout-generator-district-result';

export interface IMapLayoutGeneratorResult {
  layout: number[][];
  districts: Map<number, IMapLayoutGeneratorDistrictResult>;
}
