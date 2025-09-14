import { IDistrictInfoGeneratorDistrictResult } from './district-info-generator-district-result';

export interface IDistrictInfoGeneratorResult {
  districts: Map<number, IDistrictInfoGeneratorDistrictResult>;
}
