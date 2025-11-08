import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import sidejobsSchema from '@configs/schemas/sidejobs.json';
import { typedSidejobs } from '@state/company-state';
import { type ISidejobValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class SidejobValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.SidejobValidator)
  private _sidejobValidator!: ISidejobValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Sidejobs validation has started');

    await this.validateSchema(ajv);
    this.validateSidejobs();

    console.log('Sidejobs validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'sidejobs schema')}`);

    const validate = await ajv.compile(sidejobsSchema);

    if (!validate(typedSidejobs)) {
      console.log(`\t\t${styleText('cyanBright', 'Sidejobs schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateSidejobs() {
    Object.keys(typedSidejobs).forEach((sidejobName) => {
      this._sidejobValidator.validate(sidejobName);
    });
  }
}
