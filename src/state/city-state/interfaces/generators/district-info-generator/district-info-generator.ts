import { IDistrictInfoGeneratorResult } from './district-info-generator-result';

export interface IDistrictInfoGenerator {
  generate(): Promise<IDistrictInfoGeneratorResult>;
}
