import Ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { styleText } from 'node:util';
import cloneTemplatesSchema from '@configs/schemas/clone-templates.json';
import { typedCloneTemplates } from '@state/company-state';
import { type ICloneTemplateValidator, IValidatorFacade } from '../interfaces';
import { VALIDATOR_TYPES } from '../types';

@injectable()
export class CloneTemplateValidatorFacade implements IValidatorFacade {
  @inject(VALIDATOR_TYPES.CloneTemplateValidator)
  private _cloneTemplateValidator!: ICloneTemplateValidator;

  async validate(ajv: Ajv): Promise<void> {
    console.log('Clone templates validation has started');

    await this.validateSchema(ajv);
    this.validateCloneTemplates();

    console.log('Clone templates validation has finished');
  }

  private async validateSchema(ajv: Ajv): Promise<void> {
    console.log(`\tValidating ${styleText('cyanBright', 'clone templates schema')}`);

    const validate = await ajv.compile(cloneTemplatesSchema);

    if (!validate(typedCloneTemplates)) {
      console.log(`\t\t${styleText('cyanBright', 'Clone templates schema')} is ${styleText('redBright', 'incorrect')}`);
      console.error(validate.errors);
    }
  }

  private validateCloneTemplates() {
    Object.keys(typedCloneTemplates).forEach((cloneTemplateName) => {
      this._cloneTemplateValidator.validate(cloneTemplateName);
    });
  }
}
