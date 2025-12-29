import { IDistrictConnectionGraphGeneratorResult } from './district-connection-graph-generator-result';

export interface IDistrictConnectionGraphGenerator {
  generate(): Promise<IDistrictConnectionGraphGeneratorResult>;
}
