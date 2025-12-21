import { DistrictBaseMultiplierParameter } from './district-base-multiplier-parameter';

export class DistrictCodeBaseParameter extends DistrictBaseMultiplierParameter {
  getBase() {
    const districtTypeInfo = this._district.template;

    return districtTypeInfo.multiplierParameterBases.codeBase;
  }
}
