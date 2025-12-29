import {
  IDistrictState,
  IDistrictMultipliers,
  IDistrictMultiplierParameter,
  IDistrictSerializedMultipliers,
} from '../../interfaces';
import { DistrictCodeBaseParameter } from './district-code-base-parameter';
import { DistrictComputationalBaseParameter } from './district-computational-base-parameter';

export class DistrictMultipliers implements IDistrictMultipliers {
  private _codeBase: IDistrictMultiplierParameter;
  private _computationalBase: IDistrictMultiplierParameter;

  constructor(districtState: IDistrictState) {
    this._codeBase = new DistrictCodeBaseParameter(districtState);
    this._computationalBase = new DistrictComputationalBaseParameter(districtState);
  }

  get codeBase() {
    return this._codeBase;
  }

  get computationalBase() {
    return this._computationalBase;
  }

  serialize(): IDistrictSerializedMultipliers {
    return {
      codeBase: this._codeBase.serialize(),
      computationalBase: this._computationalBase.serialize(),
    };
  }

  deserialize(serializedParameters: IDistrictSerializedMultipliers): void {
    this._codeBase.deserialize(serializedParameters.codeBase);
    this._computationalBase.deserialize(serializedParameters.computationalBase);
  }
}
