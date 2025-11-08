import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import districtTypesSchema from '@configs/schemas/district-types.json';
import { typedDistrictTypes } from '@state/city-state';
import { type IDistrictTypeValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class DistrictTypeValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.DistrictTypeValidator)
  private _districtTypeValidator!: IDistrictTypeValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('District types validation has started');

    await this.validateSchema(ajv);
    this.validateDistrictTypes();

    console.log('District types validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'district types schema')}`);

    const validate = await ajv.compile(districtTypesSchema);

    if (!validate(typedDistrictTypes)) {
      console.log(`\t\t${styleText('cyanBright', 'District types schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateDistrictTypes() {
    Object.keys(typedDistrictTypes).forEach((cloneTemplateName) => {
      this._districtTypeValidator.validate(cloneTemplateName);
    });
  }
}
