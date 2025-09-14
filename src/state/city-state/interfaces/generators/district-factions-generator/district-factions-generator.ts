import { IDistrictInfoGeneratorResult } from '../district-info-generator';
import { IDistrictFactionsGeneratorResult } from './district-factions-generator-result';

export interface IDistrictFactionsGenerator {
  generate(districtInfos: IDistrictInfoGeneratorResult): Promise<IDistrictFactionsGeneratorResult>;
}
