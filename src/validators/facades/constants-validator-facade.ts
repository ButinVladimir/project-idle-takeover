import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import constantsSchema from '@configs/schemas/constants.json';
import { typedConstants } from '@shared/index';
import { type IConstantsValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class ConstantsValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.ConstantsValidator)
  private _constantsValidator!: IConstantsValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Constants validation has started');

    await this.validateSchema(ajv);
    this._constantsValidator.validate();

    console.log('Constants validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'constants schema')}`);

    const validate = await ajv.compile(constantsSchema);

    if (!validate(typedConstants)) {
      console.log(`\t\t${styleText('cyanBright', 'Constants schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }
}
