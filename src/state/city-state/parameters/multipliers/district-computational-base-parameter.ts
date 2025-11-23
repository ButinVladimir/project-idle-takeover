import { DistrictBaseMultiplierParameter } from './district-base-multiplier-parameter';

export class DistrictComputationalBaseParameter extends DistrictBaseMultiplierParameter {
  getBase() {
    const districtTypeInfo = this._district.template;

    return districtTypeInfo.multiplierParameterBases.computationalBase;
  }
}
