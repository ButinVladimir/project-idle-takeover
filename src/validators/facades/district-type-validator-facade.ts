import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import districtTypes from '@configs/district-types.json';
import { SCHEMA_PROPERTY } from '@shared/index';
import { type IDistrictTypeValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class DistrictTypeValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.DistrictTypeValidator)
  private _districtTypeValidator!: IDistrictTypeValidator;

  private _parameters!: {fn: (districtTypeName: string) => boolean, name: string}[];

  async validate(): Promise<void> {
    console.log('District types validation has started');

    this._parameters = [
      { fn: this._districtTypeValidator.validateDistrictTypeTitle, name: 'title' },
      { fn: this._districtTypeValidator.validateDistrictTypeOverview, name: 'overview' },
    ];

    Object.keys(districtTypes).forEach((districtTypeName) => {
      if (districtTypeName === SCHEMA_PROPERTY) {
        return;
      }

      this.validateDistrictType(districtTypeName);
    });

    console.log('District types validation has finished');
  }

  private validateDistrictType(districtType: string) {
    this._parameters.forEach((parameter) => {
      const result = parameter.fn.call(this._districtTypeValidator, districtType);

      if (!result) {
        this.printError(districtType, parameter.name);
      }
    });
  }

  private printError(districtTypeName: string, error: string) {
    const text = `District type ${styleText('cyanBright', districtTypeName)} is missing ${styleText('redBright', error)}`;

    console.log(text);
  }

}
