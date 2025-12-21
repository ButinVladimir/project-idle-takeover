import { inject, injectable } from 'inversify';
import Ajv from 'ajv';
import { styleText } from 'node:util';
import namesSchema from '@configs/schemas/names.json';
import { typedNames } from '@shared/index';
import { type INameValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class NameValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.NameValidator)
  private _nameValidator!: INameValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Name validation has started');

    await this.validateSchema(ajv);
    this.validateCloneNames();
    this.validateDistrictNames();

    console.log('Name validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'names schema')}`);

    const validate = await ajv.compile(namesSchema);

    if (!validate(typedNames)) {
      console.log(`\t\t${styleText('cyanBright', 'Names schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateCloneNames() {
    typedNames.clones.forEach((name) => {
      this._nameValidator.validateCloneName(name);
    });
  }

  private validateDistrictNames() {
    typedNames.districts.forEach((name) => {
      this._nameValidator.validateDistrictName(name);
    });
  }
}
